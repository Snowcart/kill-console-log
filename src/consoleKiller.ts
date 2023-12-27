import * as vscode from "vscode";
import fs from "fs";
import ts from "typescript";
import path from "path";

export const killConsoleLogsInFile = (editor: vscode.TextEditor) => {
    if (!editor) {
      vscode.window.showInformationMessage("No active text editor");
      return; // there is no active text editor.
    }
    const document = editor.document;
    const text = document.getText();
    const rangesToDelete: vscode.Range[] = [];
  
    // Parse the file using TypeScript
    const sourceFile = ts.createSourceFile(
      document.fileName,
      text,
      ts.ScriptTarget.Latest,
      true
    );
  
    const handleNode = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const expression = node.expression;
        if (ts.isPropertyAccessExpression(expression) &&
            expression.expression.kind === ts.SyntaxKind.Identifier &&
            (expression.expression as ts.Identifier).text === 'console' &&
            expression.name.text === 'log') {
  
          let start = node.pos;
          let end = node.end;
  
          // Adjust end to include semicolon if present
          if (text[end] === ";") {
            end++;
          }
  
          const startPosition = document.positionAt(start);
          const endPosition = document.positionAt(end);
          const line = document.lineAt(startPosition.line);
          const lineText = line.text.trim();
          const consoleLogText = text.substring(start, end).trim();
  
          if (lineText === consoleLogText || lineText === consoleLogText + ";") {
            // Delete the entire line if console.log is the only thing on it (including semicolon)
            rangesToDelete.push(line.range);
          } else {
            // Delete only the console.log part (including semicolon)
            rangesToDelete.push(new vscode.Range(startPosition, endPosition));
          }
        }
      }
      ts.forEachChild(node, handleNode);
    };
  
    handleNode(sourceFile);
  
    if (rangesToDelete.length > 0) {
      editor.edit((editBuilder) => {
        rangesToDelete.forEach((range) => {
          editBuilder.delete(range);
        });
      });
    }
  };

  export const killConsoleLogsInFileInPath = (filePath: string, isFullPath = false): void => {
    let workspaceFolder;
    if (vscode.workspace.workspaceFolders) {
        workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    } else {
        throw new Error("There is no workspace folder");
    }
    const fullPath = isFullPath ? filePath : path.join(workspaceFolder, filePath);
    let text = fs.readFileSync(fullPath, 'utf8');

    // Parse the file using TypeScript
    const sourceFile = ts.createSourceFile(
        fullPath,
        text,
        ts.ScriptTarget.Latest,
        true
    );

    let positionsToDelete: Array<{ start: number; end: number }> = [];

    const handleNode = (node: ts.Node) => {
        if (ts.isCallExpression(node)) {
            const expression = node.expression;
            if (ts.isPropertyAccessExpression(expression) &&
                expression.expression.kind === ts.SyntaxKind.Identifier &&
                (expression.expression as ts.Identifier).text === 'console' &&
                expression.name.text === 'log') {

                let start = node.pos;
                let end = node.end;

                // Include semicolon if present
                if (text[end] === ';') {
                    end++;
                }

                const startLine = text.substring(0, start).split('\n').length - 1;
                const lines = text.split('\n');
                const lineText = lines[startLine].trim();
                const consoleLogText = text.substring(start, end).trim();

                if (lineText === consoleLogText) {
                    // Adjust start and end to cover the entire line
                    start = text.lastIndexOf('\n', start) + 1;
                    if (startLine < lines.length - 1) {
                        end = text.indexOf('\n', end);
                    }
                }

                positionsToDelete.push({ start, end });
            }
        }
        ts.forEachChild(node, handleNode);
    };

    handleNode(sourceFile);

    positionsToDelete.sort((a, b) => b.start - a.start);

    let modifiedText = text;
    positionsToDelete.forEach(pos => {
        modifiedText = modifiedText.substring(0, pos.start) + modifiedText.substring(pos.end);
    });

    fs.writeFileSync(fullPath, modifiedText, 'utf8');
    vscode.window.showInformationMessage("Console logs removed from " + filePath);
};