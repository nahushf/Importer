'use strict';
import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { generateImportString, getCurrentFilePath } from './utils';
const relative = require('relative');

export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('Importer.addTSImport', () => {
        let currentFilePath = getCurrentFilePath();

        // Find all files.
        Promise.all([
            vscode.workspace.findFiles('**/**.ts', null),
            vscode.workspace.findFiles('**/**.tsx', null)
        ])
            .then(resp => {
                if (!resp || !resp.length) {
                    return;
                }

                let filePaths = resp
                    .map(promiseResponse => {
                        if (!promiseResponse || !promiseResponse.length) {
                            return;
                        }

                        return promiseResponse.map(fileDescriptor => {
                            let path = fileDescriptor.path;
                            if (path === currentFilePath) {
                                return;
                            }
                            return {
                                label: path.split('/').pop(),
                                description: path
                            }
                        }).filter(quickPickData => quickPickData !== undefined);
                    })
                    .reduce((total = [], next) => {
                        return [...total, ...next];
                    })

                    // Request import destination file.
                vscode.window.showQuickPick(filePaths)
                    .then(item => {
                        vscode.window.showInputBox({
                            value: generateImportString(item.description)
                        })
                            .then(value => {
                                let fileText = fs.readFileSync(currentFilePath).toString();
                                fs.writeFileSync(currentFilePath, `${value}\n${fileText}`);
                                vscode.window.showInformationMessage('Import string added to file.')
                            }, () => {
                                vscode.window.showErrorMessage('Could not read import string')
                            })
                    })
            })
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}