
# Theia Plugin Extension Metrics

This extension provides metrics for the theia plugin extension in the prometheus format.

It collects metrics in a few different ways:

1. Detects errors in languages that are registered directly with monaco (E.g. if an error happens here: https://github.com/microsoft/vscode-extension-samples/blob/master/completions-sample/src/extension.ts#L11 it will be reported). These errors can only be reported via their registered language configuration (plaintext, java, yaml, etc).

2. Detects total number of errors that are logged directly to the output channel for a specific vscode extension that uses a language server. These errors can only be reported via their id that is registered with the vscode-languageclient library. E.g. "YAML Support", "XML Support", etc

Due to the limitations of the vscode-languageclient library (see https://github.com/microsoft/vscode-languageserver-node/issues/517) we are unable to process errors that come from the language server directly, therefore we cannot get the total number of requests that are sent for #2. We can only get the total number of errors.

## How it works
The browser side of this extension rebinds key parts of the plugin-ext allowing us to abstract relevant metrics at certain points.

The browser then collects all these key metrics in the plugin-metrics-extractor class.

Once we have all the data we want, we need to transfer the data from the frontend to the backend so that our new metrics are display on /metrics endpoint. This communication is done via JSON-RPC where the PluginMetrics interface acts as as common way to pass information between the frontend and the backend. To learn more see [1]

The plugin-metrics-extractor will set the plugin metrics every 5 seconds [2] via pluginMetrics.setMetrics(metrics: string).

Then, every 5 seconds [2] the backend will check the plugin metrics via pluginMetrics.getMetrics() to see what the contents of the metrics are at that time.

Then, when you load up the /metrics endpoint you will see the new language metrics.

[1] - [https://www.theia-ide.org/docs/json_rpc](https://www.theia-ide.org/docs/json_rpc)

[2] - This is configurable and lives in common/metrics-protocol.ts 

## License

-  [Eclipse Public License 2.0](http://www.eclipse.org/legal/epl-2.0/)
-  [一 (Secondary) GNU General Public License, version 2 with the GNU Classpath Exception](https://projects.eclipse.org/license/secondary-gpl-2.0-cp)
