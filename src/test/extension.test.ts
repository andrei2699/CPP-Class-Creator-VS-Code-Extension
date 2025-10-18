import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('should create .h and .cpp files', async () => {
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const className = 'TestClass';
        const folderUri = vscode.Uri.file(tempDir);

        // Mock showInputBox
        const originalShowInputBox = vscode.window.showInputBox;
        (vscode.window as any).showInputBox = () => Promise.resolve(className);

        await vscode.commands.executeCommand('cppclasscreator.createClass', folderUri);

        // Restore original showInputBox
        (vscode.window as any).showInputBox = originalShowInputBox;

        const headerPath = path.join(tempDir, `${className}.h`);
        const cppPath = path.join(tempDir, `${className}.cpp`);

        assert.ok(fs.existsSync(headerPath), 'Header file should exist');
        assert.ok(fs.existsSync(cppPath), 'CPP file should exist');

        const headerContent = fs.readFileSync(headerPath, 'utf-8');
        const expectedHeaderContent = `#ifndef ${className.toUpperCase()}_H\n#define ${className.toUpperCase()}_H\n\nclass ${className} {\npublic:\n    ${className}();\n    ~${className}();\n\nprivate:\n\n};\n\n#endif // ${className.toUpperCase()}_H\n`;
        assert.strictEqual(headerContent, expectedHeaderContent, 'Header content is incorrect');

        const cppContent = fs.readFileSync(cppPath, 'utf-8');
        const expectedCppContent = `#include "${className}.h"\n\n${className}::${className}() {\n\n}\n\n${className}::~${className}() {\n\n}\n`;
        assert.strictEqual(cppContent, expectedCppContent, 'CPP content is incorrect');

        // Cleanup
        fs.unlinkSync(headerPath);
        fs.unlinkSync(cppPath);
        fs.rmdirSync(tempDir);
    });
});
