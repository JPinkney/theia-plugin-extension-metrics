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
import { OutputChannelRegistryMainImpl } from '@theia/plugin-ext/lib/main/browser/output-channel-registry-main';
import { PluginMetricsCreator } from './plugin-metrics-creator';
import { createDefaultRequestData } from './plugin-metrics-interfaces';

@injectable()
export class PluginMetricsOutputChannelRegistry extends OutputChannelRegistryMainImpl {

    @inject(PluginMetricsCreator)
    protected readonly pluginMetricsCreator: PluginMetricsCreator;

    // This is a map of output channel names to plugin ids
    private registryMap = new Map<string, string>();

    constructor() {
        super();
        this.registryMap.set('YAML Support', 'redhat.vscode-yaml');
        this.registryMap.set('XML Support', 'redhat.vscode-xml');
    }

    $append(channelName: string, errorOrValue: string): PromiseLike<void> {
        if (errorOrValue.startsWith('[Error')) {

            if (this.registryMap.has(channelName)) {

                const createdMetric = createDefaultRequestData(this.registryMap.get(channelName) as string, errorOrValue);
                this.pluginMetricsCreator.createErrorMetric(createdMetric);

            } else if (this.pluginMetricsCreator.extensionIDAnalytics.has(channelName)) {

                const createdMetric = createDefaultRequestData(channelName, errorOrValue);
                this.pluginMetricsCreator.createErrorMetric(createdMetric);

            } else {
                console.log('Could not find the correct vscode extension for this error');
            }
        }
        return super.$append(channelName, errorOrValue);
    }

}
