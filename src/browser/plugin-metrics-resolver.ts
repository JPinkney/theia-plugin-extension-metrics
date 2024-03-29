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

// tslint:disable:no-any

import { injectable, inject } from 'inversify';
import { PluginMetricsCreator } from './plugin-metrics-creator';
import { createRequestData } from './plugin-metrics-interfaces';

/**
 * This class helps resolve language server requests into successess or failures
 * and sends the data to the metricsExtractor
 */
@injectable()
export class PluginMetricsResolver {

    @inject(PluginMetricsCreator)
    private metricsCreator: PluginMetricsCreator;

    /**
     * Resolve a request for pluginID and create a metric based on whether or not
     * the language server errored.
     *
     * @param pluginID the ID of the plugin that made the request
     * @param method  the method that was request
     * @param request the result of the language server request
     */
    async resolveRequest(pluginID: string, method: string, request: PromiseLike<any> | Promise<any> | Thenable<any> | any): Promise<any> {
        const currentTime = performance.now();
        if (isPromise(request)) {
            return request.catch(error => {
                this.createAndSetMetric(pluginID, method, performance.now() - currentTime, false);
                return Promise.reject(error);
            }).then(value => {
                this.createAndSetMetric(pluginID, method, performance.now() - currentTime, true);
                return value;
            });
        } else if (isPromiseLike(request)) {
            return request.then(value => {
                this.createAndSetMetric(pluginID, method, performance.now() - currentTime, true);
                return value;
            },
                error => {
                    this.createAndSetMetric(pluginID, method, performance.now() - currentTime, false);
                    return Promise.reject(error);
                });
        } else {
            this.createAndSetMetric(pluginID, method, performance.now() - currentTime, true);
            return request;
        }
    }

    private createAndSetMetric(pluginID: string, method: string, time: number, successful: boolean): void {
        const createdSuccessMetric = createRequestData(pluginID, method, time);
        this.metricsCreator.createMetric(createdSuccessMetric, successful);
    }
}

function isPromise(potentialPromise: any): potentialPromise is Promise<any> {
    return (<Promise<any>>potentialPromise).then !== undefined;
}

function isPromiseLike(potentialPromiseLike: any): potentialPromiseLike is PromiseLike<any> {
    return (<PromiseLike<any>>potentialPromiseLike).then !== undefined;
}
