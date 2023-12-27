import * as vscode from "vscode";
import { killConsoleLogsInFile, killConsoleLogsInFileInPath } from "./consoleKiller";
import { getModifiedFiles, getProjectFiles } from "./fileHelper";

export const kill = () => {
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
  
  export const killAllGit = async () => {
    const files = await getModifiedFiles();
  
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Eliminating console logs in Git changes...",
      cancellable: true
    }, async (progress, token) => {
      const totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
  
        // Check for cancellation
        if (token.isCancellationRequested) {
          break;
        }
  
        progress.report({ 
          message: `Processing file ${i + 1} of ${totalFiles}`,
          increment: (i + 1) / totalFiles * 100
        });
  
        await killConsoleLogsInFileInPath(file);
      }
    });
  
    vscode.window.showInformationMessage("Eliminated all Console Logs in Git Changes");
  };
  
  export const killAll = async () => {
    const allProjectFiles = await getProjectFiles();
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "Eliminating console logs...",
      cancellable: true
    }, async (progress, token) => {
      const totalFiles = allProjectFiles.length;
      for (let i = 0; i < totalFiles; i++) {
        const file = allProjectFiles[i];
  
        // Check for cancellation
        if (token.isCancellationRequested) {
          break;
        }
  
        progress.report({ 
          message: `Processing file ${i + 1} of ${totalFiles}`,
          increment: (i + 1) / totalFiles * 100
        });
  
        await killConsoleLogsInFileInPath(file, true);
      }
    });
  
    vscode.window.showInformationMessage("Eliminated all Console Logs in Project");
  };