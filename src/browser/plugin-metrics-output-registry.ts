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

import { injectable, interfaces } from 'inversify';
import { OutputChannelRegistryMainImpl } from '@theia/plugin-ext/lib/main/browser/output-channel-registry-main';
import { PluginMetricsExtractor } from './plugin-metrics-extractor';

@injectable()
export class PluginMetricsOutputChannelRegistry extends OutputChannelRegistryMainImpl {

    protected readonly pluginMetricsExtractor: PluginMetricsExtractor;

    constructor(container: interfaces.Container) {
        super(container);
        this.pluginMetricsExtractor = container.get(PluginMetricsExtractor);
    }

    $append(channelName: string, value: string): PromiseLike<void> {
        if (value.startsWith('[Error')) {
            // We need to log to channelName
            this.pluginMetricsExtractor.mine(channelName, false);
        }
        return super.$append(channelName, value);
    }

}
