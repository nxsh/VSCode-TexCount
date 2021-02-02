import * as vscode from 'vscode';
import { exec, execSync } from 'child_process';

let myStatusBarItem: vscode.StatusBarItem;

export function activate({ subscriptions}: vscode.ExtensionContext) {
	// register a command that is invoked when the status bar
	// item is selected
	const myCommandId = 'texcount.showBriefOutput';
	subscriptions.push(vscode.commands.registerCommand(myCommandId, () => {
		const n = getNumberOfWords(vscode.window.activeTextEditor);
		//n[2] = n[2].replace( /[^\d].*/, '' );
		vscode.window.showInformationMessage(`Body: ${n[0]}, Header: ${n[1]}`);
		//vscode.window.showInformationMessage(`Body: ${n[0]}, Header: ${n[1]}, Outside: ${n[2]}`);
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
	const t = n.reduce((a, b) => a + b, 0)
	if (t > 0 && vscode.window.activeTextEditor?.document.languageId === "latex") {
		myStatusBarItem.text = `$(pencil) ${t} words`;
		myStatusBarItem.show();
	}  
	else if (t == 0 && vscode.window.activeTextEditor?.document.languageId === "latex") {
		myStatusBarItem.text = `$(pencil) ${t} words`;
		myStatusBarItem.show();
	}
	else {
		myStatusBarItem.hide();
	}
}

function getNumberOfWords(editor: vscode.TextEditor | undefined): number[] {
        let doc = editor!.document
		let fn = doc.fileName.replace(/ /g, "\\ ")
		//let dirArr = doc.fileName.split("/")
		//let dir = fn.replace(dirArr[dirArr.length-1], "")

        //let cmdOutputBrief = 'texcount -brief -inc -dir=' + dir + " " +fn;

        let cmdOutputBrief = 'texcount -brief ' +fn;
        // Store output of texcount to a string
        let texOut = execSync(cmdOutputBrief).toString()
		//console.log(texOut)

        // Split the string into array elements
        const countArr = texOut.split("+")
        //const countArr = texOut.split("\n") // split by line without -brief flag
		//console.log(countArr)
      
		// 	OUTPUT OF A TEXCOUNT IS DIFFERENT IF THERE IS MORE THAN ONE TEX FILE IN PROJECT 
		//let totalLine = countArr[countArr.length-3].toString()
		//let totalVals = totalLine.split("+")
		//console.log(totalVals)
        
		// First value is the body word count 
        //const cwords = Number(totalVals[0])
        const cwords = Number(countArr[0])
        
		// Second value is the header word count
        //const hwords = Number(totalVals[1])
        const hwords = Number(countArr[1])
		
		//const owords = Number(totalVals[2].replace(/(^\d+)(.+$)/i,'$1'));

		//const total = [cwords,hwords,owords]
        return [cwords, hwords]
}