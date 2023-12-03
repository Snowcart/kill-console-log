import { error } from "console";
import simpleGit from "simple-git";
import vscode from "vscode";
import fs from "fs";
import path from "path";

export const getModifiedFiles = async () => {
    const gitPath = await getGitRepoPath();
    if (!gitPath) {
      throw error("No git path found");
    }
    const git = simpleGit(gitPath);
    const status = await git.status();

    return status.files
    .filter((file) => 
      file.index !== "M" &&
      (
        file.path.endsWith('.js') || 
        file.path.endsWith('.jsx') || 
        file.path.endsWith('.ts') || 
        file.path.endsWith('.tsx') || 
        file.path.endsWith('.html')
      )
    )
    .map((file) => file.path);
  };

export const getDocument = async (path: string) => {
  try {
    const document = await vscode.workspace.openTextDocument(path);
    return document;
  } catch (e: any) {
    vscode.window.showErrorMessage("Error opening file: " + e.message);
  }
};

export async function getGitRepoPath() {
  // Get the current workspace folders
  const workspaceFolders = vscode.workspace.workspaceFolders;

  if (workspaceFolders && workspaceFolders.length > 0) {
      // Use the first workspace folder for simplicity
      const workspacePath = workspaceFolders[0].uri.fsPath;

      // Initialize simple-git with the workspace path
      const git = simpleGit(workspacePath);

      try {
          // Check if this is a Git repository
          const isRepo = await git.checkIsRepo();
          if (isRepo) {
              return workspacePath; // This is the path to your Git repository
          } else {
              vscode.window.showErrorMessage('The opened folder is not a Git repository.');
              return null;
          }
      } catch (error: any) {
          vscode.window.showErrorMessage('Error checking Git repository: ' + error.message);
          return null;
      }
  } else {
      vscode.window.showInformationMessage('No workspace folder is opened.');
      return null;
  }
}

const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
  // Skip node_modules directory
  if (dirPath.includes('/node_modules/')) {
    return arrayOfFiles;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
};

const filterFiles = (files: string[]): string[] => {
  return files.filter((file) => 
      file.endsWith('.js') || 
      file.endsWith('.jsx') || 
      file.endsWith('.ts') || 
      file.endsWith('.tsx') || 
      file.endsWith('.html')
  );
};

export const getProjectFiles = async () => {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showInformationMessage("No workspace folders found.");
    return [];
  }

  return await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "Searching for files",
    cancellable: true
  }, async (progress, token) => {
    let allFiles: string[] = [];
    if (vscode.workspace.workspaceFolders)
    {
      for (const folder of vscode.workspace.workspaceFolders) {
        const folderPath = folder.uri.fsPath;
        progress.report({ message: `Processing folder: ${folder.name}` });
        allFiles = allFiles.concat(getAllFiles(folderPath));
      }
    }

    const filteredFiles = filterFiles(allFiles);
    return filteredFiles;
  });
};