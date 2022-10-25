const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('api', {
	music_api: (params)=> ipcRenderer.invoke('music_api', params)
})