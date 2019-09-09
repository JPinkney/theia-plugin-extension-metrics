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

interface ErrorResponses {
    totalErrors: number;
}

// Purpose of this class is to mine the plugin metrics for data we want
@injectable()
export class PluginMetricsExtractor {

    @inject(PluginMetrics)
    private pluginMetrics: PluginMetrics;

    private extensionIDSuccess = new Map<string, Success>();
    private extensionErrors = new Map<string, ErrorResponses>();

    private prometheusHeader = '# HELP language_server_metrics Percentage of successful language requests\n# TYPE language_server_metrics gauge\n';

    constructor() {
        this.convertExtensionMapToString();
    }

    async mine(id: string, isRequestSuccessful: boolean): Promise<void> {
        if (!id) {
            return;
        }

        if (!this.extensionIDSuccess.has(id)) {
            this.extensionIDSuccess.set(id, {
                succesfulResponses: 0,
                totalRequests: 0
            });
        }

        const thisExtension = this.extensionIDSuccess.get(id) as Success;
        thisExtension.totalRequests += 1;
        if (isRequestSuccessful) {
            thisExtension.succesfulResponses += 1;
        }
    }

    /**
     * This method is called by the output channel when an error is detected.
     * Since the output channel does not have an associated model or language client
     * we can't figure out how many total errors there are. Instead, we opt to log
     * the total number of errors that appear for a vscode extension
     *
     * @param id the id of the output channel that errored
     */
    async mineErrors(id: string): Promise<void> {
        if (!id) {
            return;
        }

        if (!this.extensionErrors.has(id)) {
            this.extensionErrors.set(id, {
                totalErrors: 0
            });
        }

        const thisExtension = this.extensionErrors.get(id) as ErrorResponses;
        thisExtension.totalErrors += 1;
    }

    /**
     * Only send the string to the plugin metrics every ${METRICS_TIMEOUT}
     * seconds so it doesn't update every single request
     */
    private convertExtensionMapToString(): void {
        setInterval(() => {
            let metricString = this.prometheusHeader;
            this.extensionIDSuccess.forEach((value, key) => {
                metricString += this.createPrometheusMetric(key, value);
            });
            this.extensionErrors.forEach((value, key) => {
                metricString += this.createPrometheusMetric(key, value);
            });
            this.pluginMetrics.setMetrics(metricString);
        }, METRICS_TIMEOUT);
    }

    private createPrometheusMetric(id: string, success: Success | ErrorResponses): string {
        if (this.isErrorResponse(success)) {
            return `language_server_metrics{id="${id}"} ${success.totalErrors}\n`;
        } else {
            return `language_server_metrics{id="${id}"} ${(success.succesfulResponses / success.totalRequests) * 100}\n`;
        }
    }

    // tslint:disable-next-line:no-any
    private isErrorResponse(a: any): a is ErrorResponses {
        // tslint:disable-next-line:no-any
        return (<ErrorResponses>a).totalErrors !== undefined;
    }

}
