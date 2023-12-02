import * as vscode from "vscode";
import acorn from "acorn";
import walk from "acorn-walk";
import simpleGit from "simple-git";
import fs from "fs";

export const killConsoleLogsInFile = (editor: vscode.TextEditor) => {
  if (!editor) {
    vscode.window.showInformationMessage("No active text editor");
    return; // there is no active text editor.
  }
  const document = editor.document;
  const text = document.getText();
  const rangesToDelete: vscode.Range[] = [];

  try {
    const ast = acorn.parse(text, { ecmaVersion: 2020, sourceType: "module" });

    walk.simple(ast, {
      CallExpression(node: any) {
        if (
          node.callee.type === "MemberExpression" &&
          node.callee.object.name === "console" &&
          node.callee.property.name === "log"
        ) {
          let startPosition = document.positionAt(node.start);
          let endPosition = document.positionAt(node.end);

          // Check if console.log is the only command on its line
          const line = document.lineAt(startPosition.line);
          const lineText = line.text;
          const lineTrimmed = lineText.trim();
          let consoleLogText = text.substring(node.start, node.end);

          // Include semicolon if present
          if (text[node.end] === ";") {
            consoleLogText += ";";
            endPosition = document.positionAt(node.end + 1);
          }

          if (lineTrimmed === consoleLogText) {
            // Expand range to the entire line, including the line break
            startPosition = new vscode.Position(startPosition.line, 0);
            endPosition =
              startPosition.line < document.lineCount - 1
                ? document.lineAt(startPosition.line + 1).range.start
                : new vscode.Position(startPosition.line, lineText.length);
          }

          rangesToDelete.push(new vscode.Range(startPosition, endPosition));
        }
      },
    });

    if (rangesToDelete.length > 0) {
      editor.edit((editBuilder) => {
        rangesToDelete.forEach((range) => {
          editBuilder.delete(range);
        });
      });
    }
  } catch (e: any) {
    vscode.window.showErrorMessage("Error parsing js file: " + e.message);
  }
};

export const killConsoleLogsInFileInPath = (filePath: string): void => {
    let text = fs.readFileSync(filePath, 'utf8');
    let modifiedText = text;
  
    try {
      const ast = acorn.parse(text, { ecmaVersion: 2020, sourceType: 'module' }) as acorn.Node;
  
      interface Position {
        start: number;
        end: number;
      }
  
      const positionsToDelete: Position[] = [];
  
      walk.simple(ast, {
        CallExpression(node: any) {
          if (
            node.callee.type === 'MemberExpression' &&
            node.callee.object.name === 'console' &&
            node.callee.property.name === 'log'
          ) {
            let { start, end } = node;
  
            // Include semicolon if present
            if (text[end] === ';') {
              end++;
            }
  
            // Check if console.log is the only command on its line
            const startLine = text.substring(0, start).split('\n').length - 1;
            const endLine = text.substring(0, end).split('\n').length - 1;
            const lines = text.split('\n');
  
            const lineText = lines[startLine].trim();
            const consoleLogText = text.substring(start, end).trim();
  
            if (lineText === consoleLogText) {
              // Expand range to the entire line
              start = text.lastIndexOf('\n', start) + 1;
              end = endLine < lines.length - 1 ? text.indexOf('\n', end) + 1 : text.length;
            }
  
            positionsToDelete.push({ start, end });
          }
        },
      });
  
      // Sort positions in reverse order to avoid offset issues when deleting
      positionsToDelete.sort((a, b) => b.start - a.start);
  
      positionsToDelete.forEach(pos => {
        // Handling the deletion logic here
        modifiedText = modifiedText.substring(0, pos.start) + modifiedText.substring(pos.end);
      });
  
      fs.writeFileSync(filePath, modifiedText, 'utf8');
    } catch (e: any) {
      console.error('Error parsing js file:', e.message);
    }
  };
  