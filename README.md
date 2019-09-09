# Theia Plugin Extension Metrics

This extension provides metrics for the theia plugin extension using the prometheus API.

It collects metrics in a few different ways:
1. Detects errors in languages that are registered directly with monaco (E.g. if an error happens here: https://github.com/microsoft/vscode-extension-samples/blob/master/completions-sample/src/extension.ts#L11 it will be reported). These errors can only be reported via their registered language configuration (plaintext, java, yaml, etc).

2. Detects total number of errors that are logged directly to the output channel for a specific vscode extension that uses a language server. These errors can only be reported via their id that is registered with the vscode-languageclient library. E.g. "YAML Support", "XML Support", etc

Due to the limitations of the vscode-languageclient library (see https://github.com/microsoft/vscode-languageserver-node/issues/517) we are unable to process errors that come from the language server directly, therefore we cannot get the total number of requests that are sent for #2. We can only get the total number of errors.

## License
- [Eclipse Public License 2.0](http://www.eclipse.org/legal/epl-2.0/)
- [一 (Secondary) GNU General Public License, version 2 with the GNU Classpath Exception](https://projects.eclipse.org/license/secondary-gpl-2.0-cp)
