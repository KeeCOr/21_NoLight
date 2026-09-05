const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('steam', {
  isAvailable: () => ipcRenderer.sendSync('steam:available'),
  getUserName: () => ipcRenderer.sendSync('steam:getUserName'),
})

contextBridge.exposeInMainWorld('steamAchievement', {
  unlock:     id => ipcRenderer.invoke('achievement:unlock', id),
  isUnlocked: id => ipcRenderer.sendSync('achievement:isUnlocked', id),
})
