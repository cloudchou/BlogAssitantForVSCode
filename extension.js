// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const blogDir = '/Users/cloud/git/cloudchou.github.io'
const postDir = `${blogDir}/_posts`
const newBlogPyScript = `${blogDir}/tools/NewBlog.py`
const pingSePyScript = `${blogDir}/tools/PingSeForBlog.py`

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function execCmd(cmdStr) {
    let exec = require('child_process').exec;
    exec(cmdStr, function (err, stdout, stderr) {
        if (err) {
            console.log('excec cmd error:' + stderr);
        } else {
            if (stdout) {
                console.log(stdout)
            }
            if (stderr) {
                console.error(stderr);
            }
        }
    });
}

function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "blogassistant" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.newBlog', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInputBox({ prompt: "Blog Title:" }).then((blogTitle) => {
            console.log(`user enter blog title ${blogTitle}`)
            // let workSpaceFolders = vscode.workspace.workspaceFolders
            // let foundBlogFolder = false
            // for (const workspaceFolder of workSpaceFolders) {
            //     console.log(`workspace folder : ${workspaceFolder}`)
            //     if (workspaceFolder.name === 'cloudchou.github.io') {
            //         foundBlogFolder = true
            //         break
            //     }
            // }
            // if (foundBlogFolder) {
            //     console.log('blog folder is opened. so just create file and open it')
            // } else {
            //     console.log('blog folder is not opened. so create file and open blog dir')
            // }
            let cmdStr = `${newBlogPyScript} -t "${blogTitle}"`;
            execCmd(cmdStr)
        })
        // .showInformationMessage('Hello World!');
    });
    context.subscriptions.push(disposable);

    function getLatestFiles(files, fs) {
        const validFiles = new Array();
        for (const file of files) {
            if (file.endsWith('.md')) {
                validFiles.push(file)
            }
        }
        validFiles.sort((fileName1, fileName2) => {
            let filePath1 = `${postDir}/${fileName1}`
            let filePath2 = `${postDir}/${fileName2}`
            let time1 = fs.statSync(filePath1).mtime;
            let time2 = fs.statSync(filePath2).mtime;
            if (time1 > time2) {
                return -1
            } else if (time1 < time2) {
                return 1
            }
            return 0;
        })
        let latestFiles = validFiles.slice(0, 6);
        for (const file of latestFiles) {
            console.log(file);
        }
        return latestFiles;
    }

    disposable = vscode.commands.registerCommand('extension.pingBlogSe', function () {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World!');
        var fs = require('fs');
        var path = require('path');
        let filePath = path.resolve(postDir);
        fs.readdir(filePath, (err, files) => {
            if (err) {
                console.error(err)
                vscode.window.showErrorMessage(err.message)
                return
            }
            let latestFiles = getLatestFiles(files, fs);
            vscode.window.showQuickPick(latestFiles).then((selectFileName) => {
                console.log(`user select ${selectFileName}`);
                let cmdStr = `${pingSePyScript} -t "${selectFileName}"`;
                execCmd(cmdStr)
                vscode.window.showInformationMessage('Ping Search Engine Finished!!!')
            }, (reason) => {
                console.warn(`select no file, reason : ${reason}`)
            })
        })
        // vscode.window.showQuickPick
    });

}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;