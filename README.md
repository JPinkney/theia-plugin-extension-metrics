
# Theia Plugin Extension Metrics
This extension provides metrics for the theia plugin extension in the prometheus format.

### What Metrics it Detects
1. Detects errors in languages that are registered directly with monaco (E.g. if an error happens here: https://github.com/microsoft/vscode-extension-samples/blob/master/completions-sample/src/extension.ts#L11 it will be reported).

2. Detects errors that are logged directly to the output channel for a specific vscode extension that uses a language server. These errors can only be reported via their id that is registered with the vscode-languageclient library. E.g. "YAML Support", "XML Support", etc

### Limitations & Drawbacks
Due to the limitations of the vscode-languageclient library (see https://github.com/microsoft/vscode-languageserver-node/issues/517) we are unable to process errors that come from the language server directly, instead we need to use the output channel. The output channel is great because it allows us to work around limitations of the vscode-languageclient library and still get metrics but it still has some drawbacks:

1. Everytime a language server request is resolve it counts as a success. This is because the vscode-languageclient always sends back a resolved promise even when the promise is actually rejected. The only time you can get an error is by extracing data from the output channel using a regex and connecting it back to the successes that were counted earlier. This has a few consequences:
    1. If the errors logged are not matched by the regex we have no way to know where the error occured and thus we can't link the error back to a language server method. That means that the metric we created will always show that its working 100% correctly, even though its not. This is why we currently cannot get metrics for the vscode-java extension (it uses a non-standard output format).

2. You need to manually add a mapping of the output channel id to the vscode extension id, otherwise when the request is logged to the output channel it doesn't know which vscode extension it should associate itself with. There is no way around this because the output channel id is registered in the vscode-languageclient library inside of the vscode extension and not in something like the vscode-extensions package.json.

### Implementation
The browser side of this extension rebinds key parts of the plugin-ext allowing us to abstract relevant metrics at certain points.

The browser then collects all these key metrics in the plugin-metrics-creator class.

Once we have all the data we want, we need to transfer the data from the frontend to the backend so that our new metrics are display on /metrics endpoint. This communication is done via JSON-RPC where the PluginMetrics interface acts as as common way to pass information between the frontend and the backend. To learn more see [1]

The plugin-metrics-extractor will set the plugin metrics every 5 seconds [2] via pluginMetrics.setMetrics(metrics: string).

Then, every 5 seconds [2] the backend will check the plugin metrics via pluginMetrics.getMetrics() to see what the contents of the metrics are at that time.

Then, when you load up the /metrics endpoint you will see the new language metrics.

[1] - [https://www.theia-ide.org/docs/json_rpc](https://www.theia-ide.org/docs/json_rpc)

[2] - This is configurable and lives in common/metrics-protocol.ts 

## License

-  [Eclipse Public License 2.0](http://www.eclipse.org/legal/epl-2.0/)
-  [一 (Secondary) GNU General Public License, version 2 with the GNU Classpath Exception](https://projects.eclipse.org/license/secondary-gpl-2.0-cp)
