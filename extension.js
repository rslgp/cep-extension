// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

const fetchCEP =async()=> {
	
		// The code you place here will be executed every time your command is executed
		try {
            const response = await axios.post(
                'https://www.invertexto.com/ajax/gerar-cep.php',
                new URLSearchParams({
                    estado: '',
                    pontuacao: 'true',
                }).toString(),
                {
                    headers: {
                        'accept': 'application/json, text/javascript, */*; q=0.01',
                        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'origin': 'https://www.invertexto.com',
                        'referer': 'https://www.invertexto.com/gerador-de-cep',
                        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Linux"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-origin',
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                        'x-requested-with': 'XMLHttpRequest',
                    },
                }
            );

            // Parse the JSON response
            const jsonResponse = response.data;

            // Show the JSON response in the editor
			return jsonResponse;
        } catch (error) {
            vscode.window.showErrorMessage(`Error fetching data: ${error.message}`);
        }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gerador-cep-brasil" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('gerador-cep-brasil.cepComplete', async () => {
		const cepdata = await fetchCEP();

		const jsonOutput = JSON.stringify(cepdata, null, 2);
		try{
			const document = await vscode.workspace.openTextDocument({
				content: jsonOutput,
				language: 'json',
			});
			await vscode.window.showTextDocument(document);

		}catch(e){
			vscode.window.showErrorMessage(`Error fetching data: ${e.message}`);
		}
	});

	const disposable2 = vscode.commands.registerCommand('gerador-cep-brasil.cepOnly', async () => {
		const cepdata = await fetchCEP();

		//extract from https://github.com/helixquar/randomeverything/blob/master/src/extension.ts#L293
		let e = vscode.window.activeTextEditor;
		let d = e.document;
		let sel = e.selections;
	
		e.edit(function (edit) {
			// iterate through the selections
			for (var x = 0; x < sel.length; x++) {
				//let txt = d.getText(new vscode.Range(sel[x].start, sel[x].end));
	
				
				//insert the txt in the start of the current selection
				edit.insert(sel[x].start, cepdata.cep);
			}
		});
	});

	context.subscriptions.push(disposable2);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
