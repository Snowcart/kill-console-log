import * as vscode from "vscode";
import { kill, killAll, killAllGit } from "./controller";


export function activate(context: vscode.ExtensionContext) {

  const killCommand = vscode.commands.registerCommand(
    "kill-console-log.kill",
    kill
  );
  const eliminate = vscode.commands.registerCommand(
    "kill-console-log.eliminate",
    killAllGit
  );
  const eradicate = vscode.commands.registerCommand(
    "kill-console-log.eradicate",
    killAll
  );

  context.subscriptions.push(killCommand, eliminate, eradicate);
}

// This method is called when your extension is deactivated
export function deactivate() {}