import * as vscode from 'vscode';
import { exec, execSync } from 'child_process';

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions}: vscode.ExtensionContext) {
	// register a command that is invoked when the status bar
	// item is selected
	const myCommandId = 'texcount.showBriefOutput';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		//const n = getNumberOfWords(vscode.window.activeTextEditor);
		const n = getBriefOutput(vscode.window.activeTextEditor);
		vscode.window.showInformationMessage(`Words in text: ${n[0]}, Words in header: ${n[1]}`);
	}));
	// create a new status bar item that we can now manage
	myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	myStatusBarItem.command = myCommandId;
	subscriptions.push(myStatusBarItem);

	// register some listener that make sure the status bar 
	// item always up-to-date
	subscriptions.push(vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem));
    subscriptions.push(vscode.workspace.onDidSaveTextDocument(updateStatusBarItem));

	// update status bar item once at start
	updateStatusBarItem();	
}

function updateStatusBarItem(): void {
	const n = getNumberOfWords(vscode.window.activeTextEditor);
	if (n > 0 && vscode.window.activeTextEditor?.document.languageId === "latex") {
		myStatusBarItem.text = `$(pencil) ${n} words`;
		myStatusBarItem.show();
	}  
	else if (n == 0 && vscode.window.activeTextEditor?.document.languageId === "latex") {
		myStatusBarItem.text = `$(pencil) ${n} words`;
		myStatusBarItem.show();
	}
	else {
		myStatusBarItem.hide();
	}
}

function getNumberOfWords(editor: vscode.TextEditor | undefined): number {
        let doc = editor!.document
        let cmdOutputBrief = 'texcount -brief ' + doc.fileName;

        // Store output of texcount to a string
        let texOut = execSync(cmdOutputBrief).toString()

        // Split the string into array elements
        const countArr = texOut.split("+")
        
        // First value is the body word count 
        const cwords = Number(countArr[0])

        // Second value is the header word count
        const hwords = Number(countArr[1])
        
        return cwords + hwords
}

function getBriefOutput(editor: vscode.TextEditor | undefined): any {
        let doc = editor!.document
        let cmdOutputBrief = 'texcount -brief ' + doc.fileName;

        // Store output of texcount to a string
        let texOut = execSync(cmdOutputBrief).toString()

        // Split the string into array elements
        const countArr = texOut.split("+")
        
        return countArr
}