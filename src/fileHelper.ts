import simpleGit from "simple-git";
import vscode from "vscode";

export const getModifiedFiles = async () => {
    const git = simpleGit();
    const status = await git.status();

    return status.files
      .filter((file) => file.index === "M")
      .map((file) => file.path)
      .filter((path) => /\.js|jsx|ts|tsx$/.test(path));
  };

export const getDocument = async (path: string) => {
  try {
    const document = await vscode.workspace.openTextDocument(path);
    return document;
  } catch (e: any) {
    vscode.window.showErrorMessage("Error opening file: " + e.message);
  }
};