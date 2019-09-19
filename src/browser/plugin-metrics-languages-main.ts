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

import { Range, WorkspaceSymbolParams } from '@theia/plugin-ext/lib/common/plugin-api-rpc-model';
import { PluginMetricsResolver } from './plugin-metrics-resolver';
import { LanguagesMainImpl } from '@theia/plugin-ext/lib/main/browser/languages-main';
import { SymbolInformation } from '@theia/languages/lib/browser';
import { injectable, inject } from 'inversify';
import * as vst from 'vscode-languageserver-protocol';
import { LanguagesInfo } from '@theia/plugin-ext/lib/common/plugin-api-rpc';
import { SerializedDocumentFilter } from '@theia/plugin-ext/lib/common/plugin-api-rpc-model';
import * as theia from '@theia/plugin';

@injectable()
export class LanguagesMainPluginMetrics extends LanguagesMainImpl {

    @inject(PluginMetricsResolver)
    private pluginMetricsResolver: PluginMetricsResolver;

    // Map of handle to extension id
    protected handleToExtensionID = new Map<number, string>();

    protected provideCompletionItems(handle: number, model: monaco.editor.ITextModel, position: monaco.Position,
        context: monaco.languages.CompletionContext, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CompletionList> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.CompletionRequest.type.method,
            super.provideCompletionItems(handle, model, position, context, token));
    }

    protected resolveCompletionItem(handle: number, model: monaco.editor.ITextModel, position: monaco.Position,
        item: monaco.languages.CompletionItem, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CompletionItem> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.CompletionRequest.type.method,
            super.resolveCompletionItem(handle, model, position, item, token));
    }

    protected provideReferences(handle: number, model: monaco.editor.ITextModel, position: monaco.Position,
        context: monaco.languages.ReferenceContext, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Location[]> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.ReferencesRequest.type.method,
            super.provideReferences(handle, model, position, context, token));
    }

    protected provideImplementation(handle: number, model: monaco.editor.ITextModel,
        position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Definition> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.ImplementationRequest.type.method,
            super.provideImplementation(handle, model, position, token));
    }

    protected provideTypeDefinition(handle: number, model: monaco.editor.ITextModel,
        position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Definition> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.TypeDefinitionRequest.type.method,
            super.provideTypeDefinition(handle, model, position, token));
    }

    protected provideHover(handle: number, model: monaco.editor.ITextModel, position: monaco.Position,
        token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Hover> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.HoverRequest.type.method,
            super.provideHover(handle, model, position, token));
    }

    protected provideDocumentHighlights(handle: number, model: monaco.editor.ITextModel, position: monaco.Position,
        token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.DocumentHighlight[]> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.DocumentHighlightRequest.type.method,
            super.provideDocumentHighlights(handle, model, position, token));
    }

    protected provideWorkspaceSymbols(handle: number, params: WorkspaceSymbolParams, token: monaco.CancellationToken): Thenable<SymbolInformation[]> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.WorkspaceSymbolRequest.type.method,
            super.provideWorkspaceSymbols(handle, params, token));
    }

    protected resolveWorkspaceSymbol(handle: number, symbol: SymbolInformation, token: monaco.CancellationToken): Thenable<SymbolInformation> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.WorkspaceSymbolRequest.type.method,
            super.resolveWorkspaceSymbol(handle, symbol, token));
    }

    protected async provideLinks(handle: number, model: monaco.editor.ITextModel,
        token: monaco.CancellationToken): Promise<monaco.languages.ProviderResult<monaco.languages.ILinksList>> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.DocumentLinkRequest.type.method,
            super.provideLinks(handle, model, token));
    }

    protected async resolveLink(handle: number, link: monaco.languages.ILink,
        token: monaco.CancellationToken): Promise<monaco.languages.ProviderResult<monaco.languages.ILink>> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.DocumentLinkRequest.type.method,
            super.resolveLink(handle, link, token));
    }

    protected async provideCodeLenses(handle: number, model: monaco.editor.ITextModel,
        token: monaco.CancellationToken): Promise<monaco.languages.ProviderResult<monaco.languages.CodeLensList>> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.CodeLensRequest.type.method,
            super.provideCodeLenses(handle, model, token));
    }

    protected resolveCodeLens(handle: number, model: monaco.editor.ITextModel,
        codeLens: monaco.languages.CodeLens, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.CodeLens> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.CodeLensResolveRequest.type.method,
            super.resolveCodeLens(handle, model, codeLens, token));
    }

    protected provideDocumentSymbols(handle: number, model: monaco.editor.ITextModel,
        token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.DocumentSymbol[]> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.DocumentSymbolRequest.type.method,
            super.provideDocumentSymbols(handle, model, token));
    }

    protected provideDefinition(handle: number, model: monaco.editor.ITextModel,
        position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.Definition> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.DefinitionRequest.type.method,
            super.provideDefinition(handle, model, position, token));
    }

    protected async provideSignatureHelp(handle: number, model: monaco.editor.ITextModel,
        position: monaco.Position, token: monaco.CancellationToken,
        context: monaco.languages.SignatureHelpContext): Promise<monaco.languages.ProviderResult<monaco.languages.SignatureHelpResult>> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.SignatureHelpRequest.type.method,
            super.provideSignatureHelp(handle, model, position, token, context));
    }

    protected provideDocumentFormattingEdits(handle: number, model: monaco.editor.ITextModel,
        options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.TextEdit[]> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.DocumentFormattingRequest.type.method,
            super.provideDocumentFormattingEdits(handle, model, options, token));
    }

    protected provideDocumentRangeFormattingEdits(handle: number, model: monaco.editor.ITextModel,
        range: Range, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.TextEdit[]> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.DocumentRangeFormattingRequest.type.method,
            super.provideDocumentRangeFormattingEdits(handle, model, range, options, token));
    }

    protected provideOnTypeFormattingEdits(handle: number, model: monaco.editor.ITextModel, position: monaco.Position,
        ch: string, options: monaco.languages.FormattingOptions, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.TextEdit[]> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.DocumentOnTypeFormattingRequest.type.method,
            super.provideOnTypeFormattingEdits(handle, model, position, ch, options, token));
    }

    protected provideFoldingRanges(handle: number, model: monaco.editor.ITextModel,
        context: monaco.languages.FoldingContext, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.FoldingRange[]> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.FoldingRangeRequest.type.method,
            super.provideFoldingRanges(handle, model, context, token));
    }

    protected provideDocumentColors(handle: number, model: monaco.editor.ITextModel,
        token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.IColorInformation[]> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.DocumentColorRequest.type.method,
            super.provideDocumentColors(handle, model, token));
    }

    protected provideColorPresentations(handle: number, model: monaco.editor.ITextModel,
        colorInfo: monaco.languages.IColorInformation, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.IColorPresentation[]> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.ColorPresentationRequest.type.method,
            super.provideColorPresentations(handle, model, colorInfo, token));
    }

    protected async provideCodeActions(handle: number, model: monaco.editor.ITextModel,
        rangeOrSelection: Range, context: monaco.languages.CodeActionContext,
        token: monaco.CancellationToken): Promise<monaco.languages.CodeActionList | Promise<monaco.languages.CodeActionList>> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.CodeActionRequest.type.method,
            super.provideCodeActions(handle, model, rangeOrSelection, context, token));
    }

    protected provideRenameEdits(handle: number, model: monaco.editor.ITextModel,
        position: monaco.Position, newName: string, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.WorkspaceEdit & monaco.languages.Rejection> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.RenameRequest.type.method,
            super.provideRenameEdits(handle, model, position, newName, token));
    }

    protected resolveRenameLocation(handle: number, model: monaco.editor.ITextModel,
        position: monaco.Position, token: monaco.CancellationToken): monaco.languages.ProviderResult<monaco.languages.RenameLocation> {
        return this.pluginMetricsResolver.resolveRequest(this.handleToExtensionName(handle),
            vst.RenameRequest.type.method,
            super.resolveRenameLocation(handle, model, position, token));
    }

    $registerCompletionSupport(handle: number, languageInfo: LanguagesInfo,
        selector: SerializedDocumentFilter[], triggerCharacters: string[], supportsResolveDetails: boolean): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerCompletionSupport(handle, languageInfo, selector, triggerCharacters, supportsResolveDetails);
    }

    $registerDefinitionProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerDefinitionProvider(handle, languageInfo, selector);
    }

    $registerDeclarationProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerDeclarationProvider(handle, languageInfo, selector);
    }

    $registerReferenceProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerReferenceProvider(handle, languageInfo, selector);
    }

    $registerSignatureHelpProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[], metadata: theia.SignatureHelpProviderMetadata): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerSignatureHelpProvider(handle, languageInfo, selector, metadata);
    }

    $registerImplementationProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerImplementationProvider(handle, languageInfo, selector);
    }

    $registerTypeDefinitionProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerTypeDefinitionProvider(handle, languageInfo, selector);
    }

    $registerHoverProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerHoverProvider(handle, languageInfo, selector);
    }

    $registerDocumentHighlightProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerDocumentHighlightProvider(handle, languageInfo, selector);
    }

    $registerWorkspaceSymbolProvider(handle: number, languageInfo: LanguagesInfo): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerWorkspaceSymbolProvider(handle, languageInfo);
    }

    $registerDocumentLinkProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerDocumentLinkProvider(handle, languageInfo, selector);
    }

    $registerCodeLensSupport(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[], eventHandle: number): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerCodeLensSupport(handle, languageInfo, selector, eventHandle);
    }

    $registerOutlineSupport(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerOutlineSupport(handle, languageInfo, selector);
    }

    $registerDocumentFormattingSupport(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerDocumentFormattingSupport(handle, languageInfo, selector);
    }

    $registerRangeFormattingProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerRangeFormattingProvider(handle, languageInfo, selector);
    }

    $registerOnTypeFormattingProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[], autoFormatTriggerCharacters: string[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerOnTypeFormattingProvider(handle, languageInfo, selector, autoFormatTriggerCharacters);
    }

    $registerFoldingRangeProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerFoldingRangeProvider(handle, languageInfo, selector);
    }

    $registerDocumentColorProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerDocumentColorProvider(handle, languageInfo, selector);
    }

    $registerQuickFixProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[], codeActionKinds?: string[]): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerQuickFixProvider(handle, languageInfo, selector);
    }

    $registerRenameProvider(handle: number, languageInfo: LanguagesInfo, selector: SerializedDocumentFilter[], supportsResolveLocation: boolean): void {
        this.registerPluginWithFeatureHandle(handle, languageInfo.pluginID);
        super.$registerRenameProvider(handle, languageInfo, selector, supportsResolveLocation);
    }

    private registerPluginWithFeatureHandle(handle: number, pluginID: string): void {
        this.handleToExtensionID.set(handle, pluginID);
    }

    private handleToExtensionName(handle: number): string {
        return this.handleToExtensionID.get(handle) as string;
    }
}
