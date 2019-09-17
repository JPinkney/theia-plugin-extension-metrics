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

// Define common interfaces that multiple classes can use

export interface Success {
    totalRequests: number;
    succesfulResponses: number;
    avgTimeTaken: number;
}

export interface Metric {
    pluginID: string;
    errorContentsOrMethod: string;
    timeTaken: number;
}

/**
 * Helper functions for creating an object that corresponds to the metric interface
 */
export function setMetric(pluginID: string, errorContentsOrMethod: string, timeTaken: number): Metric {
    return {
        pluginID,
        errorContentsOrMethod,
        timeTaken
    };
}

/**
 * Helper functions for creating an object that corresponds to the success interface
 */
export function setSuccess(totalRequests: number, succesfulResponses: number, avgTimeTaken: number): Success {
    return {
        avgTimeTaken,
        succesfulResponses,
        totalRequests
    };
}
