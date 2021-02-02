# VSCode-TexCount README

VSCode TexCount is a simple extension for providing a word count for `.tex` files in the bottom status bar.

## Features

Word count of current `.tex` document shown on file open and each time it is saved.

Status bar on click displays a detailed breakdown of the word count.

### Screenshots

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

VSCode 
`texcount` installed and in your `PATH`

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Known Issues

Word count does not work for documents with multiple `.tex` files, the output of `texcount` must be parsed differently.

Unsure of if this extension will work on Windows machines due to the command being a unix shell command, currently works for Mac and should work fine with Linux too.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of VSCode-TexCount.

-----------------------------------------------------------------------------------------------------------

## Future Features 

WORKING ON: currently it works perfectly for a single .tex file, however when compiling a document with multiple chapters/tex files the directory needs to be supplied, it also changes the output of texcount (with and without the -brief flag) so it needs parsing differently (there are extra/fewer lines).

PLANNED: output of `texcount` verbose shown when status bar item clicked to see which words were counted and which were not.