'use strict';
import * as path from 'path';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const relative = require('relative');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulationssadasdasdasdasdasdsadasdasd, your extension "mytestextension" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // vscode.window.showQuickPick(['option 1', 'option 2'])
        // .then(val => console.log('>> val', val))
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
                            return {
                                label: path.split('/').pop(),
                                description: path
                            }
                        })
                    })
                    .reduce((total = [], next) => {
                        return [...total, ...next];
                    })/*.forEach(path => {
                        return generateRelativePath(path.description);
                    })*/

                vscode.window.showQuickPick(filePaths)
                    .then(item => {

                        console.log('>> ', generateImportString(item.description))
                        vscode.window.showInputBox({ 
                            value: generateImportString(item.description) 
                        })
                            .then(value => {
                                vscode.workspace.applyEdit(new vscode.WorkspaceEdit().insert())
                                console.log(arguments)
                                // Edit current text document.
                            })
                    })

                /**
                 * 1. Now that paths are here , try generating relative paths. 
                 *     Possible strategy: find package.json. find common paths between file path and package.json path
                 *     This will give the difference between paths and generate dotted string accordingly and append to file name
                 */
            })
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function generateImportString(destinationFilePath: string): string {
    return `import ${generateImportName(destinationFilePath)} from ${generateRelativePath(destinationFilePath)}`;
}

function generateImportName(filePath: string): string {
    if (!filePath) {
        return;
    }

    let pathTokens: string[] = filePath.split('/');
    let fileName = pathTokens[pathTokens.length - 1];

    if (!fileName) {
        return;
    }

    return capitalize(fileName.split('.')[0]);
}

function capitalize(str: string): string {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

/*function getCurrentFilePath(): string {
    let currentDocument = vscode.workspace.textDocuments[0]
    if (!currentDocument) {
        return;
    }

    
    return 
}*/

function generateRelativePath(to: string) {
    let currentDocument = vscode.workspace.textDocuments[0]

    if (!currentDocument) {
        vscode.window.showErrorMessage('No file open cannot add generate import');
        throw new Error('No file open cannot add generate import');
    }

    let currentFilePath = currentDocument.fileName;
    console.log('>> ', currentFilePath, ' >> currentFilePath')
    console.log('>> ', to, ' >> to')
    
    let relativePath = path.relative(currentFilePath, to);

    console.log('>> ', relativePath);

    return relativePath;
}