/********************************************************************************
 * Copyright (C) 2019 Red Hat, Inc. and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { inject, injectable } from 'inversify';
import { PluginMetrics, METRICS_TIMEOUT } from '../common/metrics-protocol';
import { AnalyticsFromRequests, DataFromRequest, createRequestData, createDefaultAnalytics } from './plugin-metrics-interfaces';
import { PluginMetricSuccessOutput } from './metric-output/plugin-metrics-success-output';
import { PluginMetricTimeOutput } from './metric-output/plugin-metrics-time-output';

@injectable()
export class PluginMetricsCreator {

    @inject(PluginMetrics)
    private pluginMetrics: PluginMetrics;

    private _extensionIDAnalytics = new Map<string, Map<string, AnalyticsFromRequests>>();

    private NODE_BASED_REGEX = /(?<=Request)(.*?)(?=failed)/;

    private pluginMetricsSuccessOutput: PluginMetricSuccessOutput;
    private pluginMetricsTimeOutput: PluginMetricTimeOutput;

    constructor() {
        this.setPluginMetrics();

        this.pluginMetricsSuccessOutput = new PluginMetricSuccessOutput();
        this.pluginMetricsTimeOutput = new PluginMetricTimeOutput();
    }

    /**
     * Create an error metric for requestData.pluginID by attempting to extract the erroring
     * language server method from the requestData.errorContentsOrMethod. If it cannot extract the
     * error language server method from requestData.errorContentsOrMethod then it will not
     * create a metric.
     *
     * @param pluginID The id of the plugin
     * @param errorContents The contents that the langauge server error has produced
     */
    async createErrorMetric(requestData: DataFromRequest): Promise<void> {
        if (!requestData.pluginID) {
            return;
        }

        const method = this.extractMethodFromValue(requestData.errorContentsOrMethod);

        // only log the metric if we can find the method that it occured in
        if (method) {
            const createdMetric = createRequestData(requestData.pluginID, method, requestData.timeTaken);
            this.createMetric(createdMetric, false);

            this.decreaseExtensionRequests(requestData.pluginID, method);
        }
    }

    /**
     * Decreases the total requests and the successful responses for pluginID with method by 1.
     *
     * This is needed because an error and a successful language server request aren't currently
     * associated together because of https://github.com/microsoft/vscode-languageserver-node/issues/517.
     * That means that every language server request that resolves counts as a successful language server request.
     * Therefore, we need to decrease the extension requests for pluginID when we know there is an error.
     * Otherwise, for every language server request that errors we would count it as both a success and a failure.
     *
     * @param pluginID The id of the plugin that should have the decreased requests
     */
    private decreaseExtensionRequests(pluginID: string, method: string): void {
        const thisExtension = this._extensionIDAnalytics.get(pluginID);
        if (thisExtension) {
            const currentAnalytics = thisExtension.get(method);
            if (currentAnalytics) {
                currentAnalytics.totalRequests -= 1;
                currentAnalytics.succesfulResponses -= 1;
            }
        }
    }

    /**
     * Update the internal metrics structure for pluginID with method when a request is made
     *
     * @param requestData The data from the request that was made
     * @param isRequestSuccessful If the language server request was successful or not
     */
    async createMetric(requestData: DataFromRequest, isRequestSuccessful: boolean): Promise<void> {
        if (!requestData.pluginID) {
            return;
        }

        // When we are in this function we know its a method so we can make it clearer
        const method = requestData.errorContentsOrMethod;
        const defaultAnalytic = createDefaultAnalytics(requestData.timeTaken);

        this.createExtensionIDAnalyticIfNotFound(requestData, defaultAnalytic);
        this.createExtensionIDMethodIfNotFound(requestData, defaultAnalytic);

        const thisExtension = this._extensionIDAnalytics.get(requestData.pluginID);
        if (thisExtension) {
            const currentAnalytic = thisExtension.get(method);
            if (currentAnalytic) {
                currentAnalytic.totalRequests += 1;
                if (isRequestSuccessful) {
                    currentAnalytic.succesfulResponses += 1;
                }
                currentAnalytic.avgTimeTaken = this.calculateAvgTime(currentAnalytic, requestData.timeTaken);
            }
        }
    }

    /**
     * Create an entry in _extensionIDAnalytics with createdAnalytic if there does not exist one
     *
     * @param requestData data that we will turn into metrics
     * @param createdAnalytic the analytic being created
     */
    private createExtensionIDAnalyticIfNotFound(requestData: DataFromRequest, createdAnalytic: AnalyticsFromRequests): void {
        const method = requestData.errorContentsOrMethod; // We know its a metric if this is being called

        if (!this._extensionIDAnalytics.has(requestData.pluginID)) {
            this._extensionIDAnalytics.set(requestData.pluginID, new Map().set(method, createdAnalytic));
        }
    }

    /**
     * Create an entry in _extensionIDAnalytics for requestData.pluginID with requestData.errorContentsOrMethod as the method
     * if there does not exist one
     *
     * @param requestData data that we will turn into metrics
     * @param createdAnalytic the analytic being created
     */
    private createExtensionIDMethodIfNotFound(requestData: DataFromRequest, createdAnalytic: AnalyticsFromRequests): void {
        const method = requestData.errorContentsOrMethod; // We know its a metric if this is being called

        if (this._extensionIDAnalytics.has(requestData.pluginID)) {
            const methodToAnalyticMap = this._extensionIDAnalytics.get(requestData.pluginID) as Map<string, AnalyticsFromRequests>;
            if (!methodToAnalyticMap.has(method)) {
                methodToAnalyticMap.set(method, createdAnalytic);
            }
        }
    }

    /**
     * setPluginMetrics is a constant running function that sets
     * pluginMetrics every {$METRICS_TIMEOUT} seconds so that it doesn't
     * update /metrics on every request
     */
    private setPluginMetrics(): void {
        setInterval(() => {
            if (this._extensionIDAnalytics.size !== 0) {

                let metricString = this.pluginMetricsSuccessOutput.header;
                this._extensionIDAnalytics.forEach((value, key) => {
                    value.forEach((analytic, method) => {
                        metricString += this.pluginMetricsSuccessOutput.createMetricOutput(key, method, analytic);
                    });
                });

                metricString += this.pluginMetricsTimeOutput.header;
                this._extensionIDAnalytics.forEach((value, key) => {
                    value.forEach((analytic, method) => {
                        metricString += this.pluginMetricsTimeOutput.createMetricOutput(key, method, analytic);
                    });
                });

                this.pluginMetrics.setMetrics(metricString);

            }
        }, METRICS_TIMEOUT);
    }

    // Map of plugin extension id to method to analytic
    get extensionIDAnalytics(): Map<string, Map<string, AnalyticsFromRequests>> {
        return this._extensionIDAnalytics;
    }

    /**
     * Attempts to extract the method name from the current errorContents using the
     * vscode-languageclient matching regex.
     *
     * If it cannot find a match in the errorContents it returns undefined
     *
     * @param errorContents The contents of the current error or undefined
     */
    private extractMethodFromValue(errorContents: string | undefined): string | undefined {
        if (!errorContents) {
            return undefined;
        }
        const matches = errorContents.match(this.NODE_BASED_REGEX);
        if (matches) {
            return matches[0].trim();
        }
        return undefined;
    }

    /**
     * Calculate the average time it takes for all the requests to be made
     *
     * @param currentAnalytics The current analytics
     * @param time the time it took for the current request to complete
     */
    private calculateAvgTime(currentAnalytics: AnalyticsFromRequests, time: number): number {
        return (((currentAnalytics.totalRequests - 1) * currentAnalytics.avgTimeTaken) + time) / currentAnalytics.totalRequests;
    }

}
