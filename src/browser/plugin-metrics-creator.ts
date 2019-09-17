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

interface Success {
    totalRequests: number;
    succesfulResponses: number;
}

@injectable()
export class PluginMetricsCreator {

    @inject(PluginMetrics)
    private pluginMetrics: PluginMetrics;

    // Map of plugin extension id to method id to success
    private _extensionIDSuccess = new Map<string, Map<string, Success>>();

    private METHOD_NOT_FOUND = 'unknown';
    private NODE_BASED_REGEX = /(?<=Request)(.*?)(?=failed)/;
    private prometheusHeader = '# HELP language_server_metrics Percentage of successful language requests\n# TYPE language_server_metrics gauge\n';

    constructor() {
        this.convertExtensionMapToString();
    }

    /**
     * Create an error metric for pluginID by attempting to extract the erroring
     * language server method from the errorContents. If it cannot extract the
     * error language server method from the errorContents then it will show
     * the method as "unknown"
     *
     * @param pluginID The id of the plugin
     * @param errorContents The contents that the langauge server error has produced
     */
    async createErrorMetric(pluginID: string, errorContents: string): Promise<void> {
        if (!pluginID) {
            return;
        }

        const method = this.extractMethodFromValue(errorContents);

        this.createMetric(pluginID, method, false);
        this.decreaseExtensionRequests(pluginID, method);
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
        const thisExtension = this._extensionIDSuccess.get(pluginID);
        if (thisExtension) {
            const successes = thisExtension.get(method);
            if (successes) {
                successes.totalRequests -= 1;
                successes.succesfulResponses -= 1;
            }
        }
    }

    /**
     * Update the internal metrics structure for pluginID with method when a request is made
     *
     * @param pluginID the ID of the plugin
     * @param method the method that you want to update
     * @param isRequestSuccessful is the language server request successful or not
     */
    async createMetric(pluginID: string, method: string, isRequestSuccessful: boolean): Promise<void> {
        if (!pluginID) {
            return;
        }

        if (!this._extensionIDSuccess.has(pluginID)) {
            this._extensionIDSuccess.set(pluginID, new Map().set(method, {
                succesfulResponses: 0,
                totalRequests: 0
            } as Success));
        } else if (this._extensionIDSuccess.has(pluginID)) {
            const z = this._extensionIDSuccess.get(pluginID) as Map<string, Success>;
            if (!z.has(method)) {
                z.set(method, {
                    succesfulResponses: 0,
                    totalRequests: 0
                });
            }
        }

        const thisExtension = this._extensionIDSuccess.get(pluginID);
        if (thisExtension) {
            const successes = thisExtension.get(method);
            if (successes) {
                successes.totalRequests += 1;
                if (isRequestSuccessful) {
                    successes.succesfulResponses += 1;
                }
            }
        }
    }

    /**
     * Only send the string to the plugin metrics every ${METRICS_TIMEOUT}
     * seconds so it doesn't update every single request to /metrics
     */
    private convertExtensionMapToString(): void {
        setInterval(() => {
            let metricString = this.prometheusHeader;
            this._extensionIDSuccess.forEach((value, key) => {
                value.forEach((success, method) => {
                    metricString += this.createPrometheusMetric(key, method, success);
                });
            });
            this.pluginMetrics.setMetrics(metricString);
        }, METRICS_TIMEOUT);
    }

    private createPrometheusMetric(id: string, method: string, success: Success): string {
        return `language_server_metrics{id="${id}" method="${method}"} ${(success.succesfulResponses / success.totalRequests) * 100}\n`;
    }

    get extensionIDSuccess(): Map<string, Map<string, Success>> {
        return this._extensionIDSuccess;
    }

    /**
     * Attempts to extract the method name from the current errorContents using the
     * vscode-languageclient matching regex.
     *
     * If it cannot find a match in the errorContents it returns 'unknown'
     *
     * @param errorContents The contents of the current error
     */
    private extractMethodFromValue(errorContents: string | undefined): string {
        if (!errorContents) {
            return this.METHOD_NOT_FOUND;
        }
        const matches = errorContents.match(this.NODE_BASED_REGEX);
        if (matches) {
            return matches[0].trim();
        }
        return this.METHOD_NOT_FOUND;
    }

}