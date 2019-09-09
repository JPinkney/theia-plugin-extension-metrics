/********************************************************************************
 * Copyright (C) 2019 Red Hat and others.
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

import { LanguagesMainImpl } from '@theia/plugin-ext/lib/main/browser/languages-main';
import { LanguageSelector } from '@theia/plugin-ext/lib/plugin/languages';
import { Range, DocumentLink, CodeLensSymbol, SingleEditOperation } from '@theia/plugin-ext/lib/common/plugin-api-rpc-model';
import { PluginMetricsResolver } from './plugin-metrics-resolver';
import { RPCProtocol } from '@theia/plugin-ext/lib/common/rpc-protocol';
import { WorkspaceEditDto } from '@theia/plugin-ext/lib/common/plugin-api-rpc';

export class LanguagesMainPluginMetrics extends LanguagesMainImpl {

    private pluginMetricsResolver: PluginMetricsResolver;

    constructor(proxy: RPCProtocol, pluginMetricsResolver: PluginMetricsResolver) {
        super(proxy);
        this.pluginMetricsResolver = pluginMetricsResolver;
    }

    provideCompletionItemsImpl(handle: number,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.modes.SuggestContext,
        token: monaco.CancellationToken): Thenable<monaco.modes.ISuggestResult> {

        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideCompletionItemsImpl(handle, model, position, context, token));
    }

    resolveCompletionItemImpl(handle: number,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        suggestion: monaco.modes.ISuggestion,
        token: monaco.CancellationToken): PromiseLike<monaco.modes.ISuggestion> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.resolveCompletionItemImpl(handle, model, position, suggestion, token));
    }

    provideReferencesImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        context: monaco.languages.ReferenceContext,
        token: monaco.CancellationToken): monaco.languages.Location[] | Thenable<monaco.languages.Location[]> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideReferencesImpl(handle, selector, model, position, context, token));
    }

    provideImplementationImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken): monaco.languages.Definition |
        monaco.languages.DefinitionLink[] | Thenable<monaco.languages.Definition | monaco.languages.DefinitionLink[]> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideImplementationImpl(handle, selector, model, position, token));
    }

    provideTypeDefinitionImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken): monaco.languages.Definition |
        monaco.languages.DefinitionLink[] | Thenable<monaco.languages.Definition | monaco.languages.DefinitionLink[]> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideTypeDefinitionImpl(handle, selector, model, position, token));
    }

    provideHoverImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken): Promise<monaco.languages.Hover | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideHoverImpl(handle, selector, model, position, token));
    }

    provideDocumentHighlightsImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken): monaco.languages.DocumentHighlight[] | PromiseLike<monaco.languages.DocumentHighlight[]> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideDocumentHighlightsImpl(handle, selector, model, position, token));
    }

    // provideWorkspaceSymbolsImpl(handle: number, params: vst.WorkspaceSymbolParams, token: monaco.CancellationToken): Thenable<vst.SymbolInformation[]> {
    //     return this.pluginMetricsResolver.requestMetric(undefined, super.provideWorkspaceSymbolsImpl(handle, params, token));
    // }

    // resolveWorkspaceSymbolImpl(handle: number, symbol: vst.SymbolInformation, token: monaco.CancellationToken): Thenable<vst.SymbolInformation> {
    //     return this.pluginMetricsResolver.requestMetric(undefined, super.resolveWorkspaceSymbolImpl(handle, symbol, token));
    // }

    provideLinksImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        token: monaco.CancellationToken): Promise<DocumentLink[] | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideLinksImpl(handle, selector, model, token));
    }

    // resolveLinkImpl(handle: number,
    //     link: monaco.languages.ILink,
    //     token: monaco.CancellationToken): monaco.languages.ILink | PromiseLike<monaco.languages.ILink> {
    //     return this.pluginMetricsResolver.requestMetric(undefined, super.resolveLinkImpl(handle, link, token));
    // }

    provideCodeLensesImpl(handle: number,
        model: monaco.editor.ITextModel,
        token: monaco.CancellationToken): Promise<CodeLensSymbol[] | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideCodeLensesImpl(handle, model, token));
    }

    resolveCodeLensImpl(handle: number,
        model: monaco.editor.ITextModel,
        codeLens: monaco.languages.ICodeLensSymbol,
        token: monaco.CancellationToken): Promise<CodeLensSymbol | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.resolveCodeLensImpl(handle, model, codeLens, token));
    }

    provideDocumentSymbolsImpl(handle: number,
        model: monaco.editor.ITextModel,
        token: monaco.CancellationToken): Promise<monaco.languages.DocumentSymbol[] | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideDocumentSymbolsImpl(handle, model, token));
    }

    provideDefinitionImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken): monaco.languages.Definition |
        monaco.languages.DefinitionLink[] | Thenable<monaco.languages.Definition | monaco.languages.DefinitionLink[]> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideDefinitionImpl(handle, selector, model, position, token));
    }

    provideSignatureHelpImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken): Promise<monaco.languages.SignatureHelp | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideSignatureHelpImpl(handle, selector, model, position, token));
    }

    provideDocumentFormattingEditsImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        options: monaco.languages.FormattingOptions,
        token: monaco.CancellationToken): Promise<SingleEditOperation[] | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideDocumentFormattingEditsImpl(handle, selector, model, options, token));
    }

    provideDocumentRangeFormattingEdits(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        range: Range,
        options: monaco.languages.FormattingOptions,
        token: monaco.CancellationToken): Promise<SingleEditOperation[] | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideDocumentRangeFormattingEdits(handle, selector, model, range, options, token));
    }

    provideOnTypeFormattingEditsImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        ch: string,
        options: monaco.languages.FormattingOptions,
        token: monaco.CancellationToken): Promise<SingleEditOperation[] | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideOnTypeFormattingEditsImpl(handle, selector, model, position, ch, options, token));
    }

    provideFoldingRangesImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        context: monaco.languages.FoldingContext,
        token: monaco.CancellationToken): PromiseLike<monaco.languages.FoldingRange[] | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideFoldingRangesImpl(handle, selector, model, context, token));
    }

    provideDocumentColoursImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        token: monaco.CancellationToken): monaco.languages.IColorInformation[] | PromiseLike<monaco.languages.IColorInformation[]> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideDocumentColoursImpl(handle, selector, model, token));
    }

    provideColorPresentationsImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        colorInfo: monaco.languages.IColorInformation,
        token: monaco.CancellationToken): monaco.languages.IColorPresentation[] | PromiseLike<monaco.languages.IColorPresentation[]> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideColorPresentationsImpl(handle, selector, model, colorInfo, token));
    }

    provideCodeActionsImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        rangeOrSelection: monaco.Range,
        monacoContext: monaco.languages.CodeActionContext,
        token: monaco.CancellationToken,
        providedCodeActionKinds?: string[]): (monaco.languages.Command | monaco.languages.CodeAction)[] | PromiseLike<(monaco.languages.Command | monaco.languages.CodeAction)[]> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideCodeActionsImpl(handle, selector, model, rangeOrSelection, monacoContext, token, providedCodeActionKinds));
    }

    provideRenameEditsImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        newName: string,
        token: monaco.CancellationToken): PromiseLike<WorkspaceEditDto | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.provideRenameEditsImpl(handle, selector, model, position, newName, token));
    }

    resolveRenameLocationImpl(handle: number,
        selector: LanguageSelector | undefined,
        model: monaco.editor.ITextModel,
        position: monaco.Position,
        token: monaco.CancellationToken): PromiseLike<monaco.languages.RenameLocation | undefined> {
        const id = model.getModeId();
        return this.pluginMetricsResolver.requestMetric(id, super.resolveRenameLocationImpl(handle, selector, model, position, token));
    }
}
