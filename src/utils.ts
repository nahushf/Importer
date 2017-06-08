import * as vscode from 'vscode';
import * as path from 'path';

export function generateImportString(destinationFilePath: string): string {
    return `import ${generateImportName(destinationFilePath)} from '${generateRelativePath(destinationFilePath)}'`;
}

export function generateImportName(filePath: string): string {
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

export function capitalize(str: string): string {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export function getCurrentFilePath(): string {
    let currentDocument = vscode.workspace.textDocuments[0]

    if (!currentDocument) {
        vscode.window.showErrorMessage('No file open cannot generate import');
        throw new Error('No file open cannot generate import');
    }

    return currentDocument.fileName;
}

export function generateRelativePath(to: string) {
    return path.relative(getCurrentFilePath(), to);
}