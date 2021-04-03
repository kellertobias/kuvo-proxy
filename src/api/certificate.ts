import {ipcMain} from 'electron'
import { loadKeys } from '../server/encryption';

ipcMain.handle('certificate/get', async (event) => {
    const keys = loadKeys()
    return keys
})