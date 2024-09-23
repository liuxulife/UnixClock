const vscode = require('vscode');

function activate(context) {
	// 创建一个新的状态栏项
	let statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

	// 更新 Unix 时间戳的函数
	function updateTimestamp() {
		const unixTimestamp = Math.floor(Date.now() / 1000); // 获取当前 Unix 时间戳
		statusBarItem.text = `Unix: ${unixTimestamp}`; // 在状态栏显示时间戳
		statusBarItem.show(); // 显示状态栏项
	}

	// 每秒更新一次时间戳
	const interval = setInterval(updateTimestamp, 1000);

	// 初始化显示
	updateTimestamp();

	// 注册一个命令，当点击状态栏项时执行
	const insertTimestampCommand = vscode.commands.registerCommand('extension.insertTimestamp', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const unixTimestamp = Math.floor(Date.now() / 1000);
			editor.edit(editBuilder => {
				editBuilder.insert(editor.selection.active, unixTimestamp.toString());
			});
		}
	});

	// 将状态栏项的命令设置为刚注册的命令
	statusBarItem.command = 'extension.insertTimestamp';

	// 将状态栏项和定时器注册到上下文中，确保在扩展停用时释放资源
	context.subscriptions.push(statusBarItem);
	context.subscriptions.push(insertTimestampCommand);
	context.subscriptions.push(new vscode.Disposable(() => clearInterval(interval)));
}

function deactivate() {
	// 扩展停用时，可以在这里进行资源释放（如果有）
}

module.exports = {
	activate,
	deactivate
};