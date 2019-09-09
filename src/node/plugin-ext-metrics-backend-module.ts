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

import { MetricsContribution } from '@theia/metrics/lib/node/metrics-contribution';
import { PluginMetricsContribution } from './plugin-metrics';
import { PluginMetrics, metricsJsonRpcPath } from '../common/metrics-protocol';
import { PluginMetricsHandler } from './plugin-metrics-handler';
import { ConnectionHandler } from '@theia/core/lib/common/messaging/handler';
import { JsonRpcConnectionHandler } from '@theia/core';
import { ContainerModule } from 'inversify';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(PluginMetrics).to(PluginMetricsHandler).inSingletonScope();
    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(metricsJsonRpcPath, () =>
            ctx.container.get(PluginMetrics)
        )
    ).inSingletonScope();

    bind(MetricsContribution).to(PluginMetricsContribution).inSingletonScope();
});
