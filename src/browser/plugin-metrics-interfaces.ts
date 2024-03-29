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

export interface AnalyticsFromRequests {
    totalRequests: number;
    succesfulResponses: number;
    avgTimeTaken: number;
}

export interface DataFromRequest {
    pluginID: string;
    errorContentsOrMethod: string;
    timeTaken: number;
}

export interface MetricOutput {
    header: string;
    createMetricOutput(pluginID: string, method: string, requestAnalytics: AnalyticsFromRequests): string;
}

/**
 * Helper functions for creating an object that corresponds to the DataFromRequest interface
 */
export function createRequestData(pluginID: string, errorContentsOrMethod: string, timeTaken: number): DataFromRequest {
    return {
        pluginID,
        errorContentsOrMethod,
        timeTaken
    };
}

export function createDefaultRequestData(pluginID: string, errorContentsOrMethod: string): DataFromRequest {
    return {
        pluginID,
        errorContentsOrMethod,
        timeTaken: 0
    };
}

/**
 * Helper functions for creating an object that corresponds to the AnalyticsFromRequests interface
 */
export function createAnalytics(totalRequests: number, succesfulResponses: number, avgTimeTaken: number): AnalyticsFromRequests {
    return {
        avgTimeTaken,
        succesfulResponses,
        totalRequests
    };
}

export function createDefaultAnalytics(avgTimeTaken: number): AnalyticsFromRequests {
    return {
        avgTimeTaken,
        succesfulResponses: 0,
        totalRequests: 0
    };
}
