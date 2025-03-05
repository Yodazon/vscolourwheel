import * as vscode from 'vscode';
import { getWebviewContent } from './webview';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('vscolourwheel.adjustTailwindColour', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const colourMatch = text.match(/#([0-9a-fA-F]{6})/);

        if (colourMatch) {
            const colour = colourMatch[0]; // Extract the hex colour

            // Create Webview Panel
            const panel = vscode.window.createWebviewPanel(
                'colourPicker',
                'Pick a Colour',
                vscode.ViewColumn.Beside,
                {
                    enableScripts: true
                }
            );

            // Load Webview Content
            panel.webview.html = getWebviewContent(colour);

            // Listen for messages from Webview
            panel.webview.onDidReceiveMessage(
                (message) => {
                    if (message.command === 'updateColour') {
                        editor.edit(editBuilder => {
                            editBuilder.replace(selection, text.replace(colour, message.colour));
                        });
                    }
                },
                undefined,
                context.subscriptions
            );
        } else {
            vscode.window.showErrorMessage("No valid colour selected.");
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}