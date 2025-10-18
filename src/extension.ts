import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('cppclasscreator.createClass', async (folderUri: vscode.Uri) => {
        const className = await vscode.window.showInputBox({ prompt: 'Enter Class Name' });

        if (className) {
            const folderPath = folderUri.fsPath;
            const headerContent = `#ifndef ${className.toUpperCase()}_H
#define ${className.toUpperCase()}_H

class ${className} {
public:
    ${className}();
    ~${className}();

private:

};

#endif // ${className.toUpperCase()}_H
`;
            const cppContent = `#include "${className}.h"

${className}::${className}() {

}

${className}::~${className}() {

}
`;

            fs.writeFileSync(path.join(folderPath, `${className}.h`), headerContent);
            fs.writeFileSync(path.join(folderPath, `${className}.cpp`), cppContent);

            vscode.window.showInformationMessage(`Created ${className}.h and ${className}.cpp`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
