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

import { injectable, inject } from 'inversify';
import { PluginMetricsExtractor } from './plugin-metrics-extractor';

/**
 * This class takes a request from a language and converts to it success or failure.
 * From there, the plugin data extractor mines the information
 */
@injectable()
export class PluginMetricsResolver {

    @inject(PluginMetricsExtractor)
    private metricsExtrator: PluginMetricsExtractor;

    // tslint:disable-next-line:no-any
    async requestMetric(id: string, method: string, a: PromiseLike<any> | Promise<any> | Thenable<any> | any): Promise<any> {
        if (isPromise(a)) {
            return a.catch(error => Promise.reject(error)).then(value => {
                this.metricsExtrator.mine(id, method, true);
                return value;
            });
        } else if (isPromiseLike(a)) {
            return a.then(value => this.metricsExtrator.mine(id, value, true), () => this.metricsExtrator.mine(id, '', false));
        }
    }

}

// tslint:disable-next-line:no-any
function isPromise(a: any): a is Promise<any> {
    // tslint:disable-next-line:no-any
    return (<Promise<any>>a).then !== undefined;
}

// tslint:disable-next-line:no-any
function isPromiseLike(a: any): a is PromiseLike<any> {
    // tslint:disable-next-line:no-any
    return (<PromiseLike<any>>a).then !== undefined;
}
