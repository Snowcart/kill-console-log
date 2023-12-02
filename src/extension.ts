// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import acorn from "acorn";
import walk from "acorn-walk";
import simpleGit from "simple-git";
import { killConsoleLogsInFile, killConsoleLogsInFileInPath } from "./consoleKiller";
import { getDocument, getModifiedFiles } from "./fileHelper";
import fs from "fs";

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
    killAllGit
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
  killConsoleLogsInFile(editor);

  vscode.window.showInformationMessage(
    "Killed all Console Logs in current file"
  );
};

const killAllGit = async () => {
  const files = await getModifiedFiles();

  files.forEach((file) => {
    killConsoleLogsInFileInPath(file);
  }); 
  vscode.window.showInformationMessage("Eliminated all Console Logs in Git Changes");
};
