// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import { exec, execSync } from 'child_process';
import G = require('glob');
import { fileURLToPath } from 'url';
import {workspace, window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('VSCode TexCount Started!');

    // create a new word counter
    let wordCounter = new WordCounter();
    let controller = new WordCounterController(wordCounter); 

    // Add to a list of disposables which are disposed when this extension is deactivated.
    context.subscriptions.push(controller);
    context.subscriptions.push(wordCounter);
}

class WordCounter {

    private _statusBarItem!: StatusBarItem;

    public updateWordCount() {

        // Create as needed 
        if (!this._statusBarItem) { 
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left); 
        }  

        // Get the current text editor 
        let editor = window.activeTextEditor; 
        if (!editor) { 
            this._statusBarItem.hide(); 
            return; 
        } 

         let doc = editor.document; 
		 console.log(doc)

        // Only update status if an LaTeX file 
        if (doc.languageId === "latex") { 
            let wordCount = this._getWordCount(doc); 

            // Update the status bar 
            this._statusBarItem.text = wordCount !== 1 ? `$(pencil) ${wordCount} Words` : '$(pencil) 1 Word'; 
            this._statusBarItem.show(); 
        } else { 
            this._statusBarItem.hide(); 
        } 
    } 

    public _getWordCount(doc: TextDocument): Number { 

		let ss = 'texcount -brief ' + doc.fileName;

        // Store output of texcount to a string
        let texOut = execSync(ss).toString()

        // Split the string into array elements
        const countArr = texOut.split("+")
        
        // First value is the body word count 
        const cwords = Number(countArr[0])

        // Second value is the header word count
        const hwords = Number(countArr[1])
        
        return cwords+hwords 

    } 

    dispose() {
        this._statusBarItem.dispose();
    }
}

class WordCounterController {

    private _wordCounter: WordCounter;
    private _disposable: Disposable;

    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;
        this._wordCounter.updateWordCount();

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        
        workspace.onDidSaveTextDocument(this._onEvent, this, subscriptions);
        // update the counter for the current file
        this._wordCounter.updateWordCount();

        // create a combined disposable from event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        this._wordCounter.updateWordCount();
    }
}

