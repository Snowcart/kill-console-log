// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import acorn from "acorn";
import walk from "acorn-walk";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "kill-console-log" is now active!'
  );


  const killCommand = vscode.commands.registerCommand(
    "kill-console-log.kill",
    kill
  );
  const decimate = vscode.commands.registerCommand(
    "kill-console-log.decimate",
    () => {
      vscode.window.showInformationMessage(
        "Decimated all Console Logs in Git Changes"
      );
    }
  );
  const eradicate = vscode.commands.registerCommand(
    "kill-console-log.eradicate",
    () => {
      vscode.window.showInformationMessage(
        "Eradicated all Console Logs in the workspace"
      );
    }
  );

  context.subscriptions.push(killCommand, decimate, eradicate);
}

// This method is called when your extension is deactivated
export function deactivate() {}

const kill = () => {
  const editor = vscode.window.activeTextEditor;
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

  vscode.window.showInformationMessage(
    "Killed all Console Logs in current file"
  );
};
