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

// Purpose of this class is to mine the plugin metrics for data we want
@injectable()
export class PluginMetricsExtractor {

    @inject(PluginMetrics)
    private pluginMetrics: PluginMetrics;

    // Map of plugin extension id to method id to success
    private _extensionIDSuccess = new Map<string, Map<string, Success>>();

    private NODE_BASED_REGEX = /(?<=Request)(.*?)(?=failed)/;

    private prometheusHeader = '# HELP language_server_metrics Percentage of successful language requests\n# TYPE language_server_metrics gauge\n';

    constructor() {
        this.convertExtensionMapToString();
    }

    async mineErrors(id: string, value: string, isRequestSuccessful: boolean): Promise<void> {
        if (!id) {
            return;
        }

        const method = this.extractMethodFromValue(value);

        this.mine(id, method || 'unknown', isRequestSuccessful);
    }

    async mine(id: string, method: string, isRequestSuccessful: boolean): Promise<void> {
        if (!id) {
            return;
        }

        if (!this._extensionIDSuccess.has(id)) {
            this._extensionIDSuccess.set(id, new Map().set(method, {
                succesfulResponses: 0,
                totalRequests: 0
            } as Success));
        }

        const thisExtension = this._extensionIDSuccess.get(id);
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
     * seconds so it doesn't update every single request
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

    private extractMethodFromValue(value: string | undefined): string | undefined {
        if (!value) {
            return value;
        }
        const matches = value.match(this.NODE_BASED_REGEX);
        if (matches) {
            return matches[0].trim();
        }
        return undefined;
    }

}
