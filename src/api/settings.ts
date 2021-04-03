import {ipcMain} from 'electron'

import { settings, setSettings, ApplicationSettings } from '../server/settings';

ipcMain.handle('settings/get', async (event) => {
    return settings
})

ipcMain.handle('settings/set', async (event, newSettings: Partial<ApplicationSettings>) => {
    return setSettings(newSettings)
})