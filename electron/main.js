// import {app, BrowserWindow} from 'electron'
const {app, BrowserWindow,ipcMain} = require('electron')
const request_api = require('./music_api.js');
const path = require('path')

let create_window = function(){
	const win = new BrowserWindow({
		minWidth: 1050,
		minHeight: 690,
		webPreferences:{
			preload: path.join(__dirname, 'preload.js')
		}
	})

	if(app.isPackaged){
		win.loadFile('../dist/index.html')
	}else{
		win.loadURL('http://localhost:5173/')
	}
}

app.whenReady().then(()=>{
	create_window()
	app.on('activate', ()=>{
		if(BrowserWindow.getAllWindows().length === 0){
			create_window()
		}
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
	  app.quit()
	}
})


let api = request_api('./module');
ipcMain.handle('music_api', async (event, params)=>{
	// console.log(params);
	// console.log(arguments);
	api = await api;
	return api.http(params[0], params[1]);
})