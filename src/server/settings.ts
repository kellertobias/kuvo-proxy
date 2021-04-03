import fs from 'fs'
import path from 'path'
import electron from 'electron';

const dataPath = electron.app.getPath('userData');
const settingsFilePath = path.join(dataPath, 'config.json');


export interface ApplicationSettings extends Record<string, unknown> {
    callbackPath ?: string
}

export const settings : ApplicationSettings = {}
export const setSettings = (parts : Partial<ApplicationSettings>) : void => {
    for (const key in parts) {
        const element = parts[key];
        settings[key] = element
    }

    const settingsRaw = JSON.stringify(settings, null, 2)
    console.log(`Saving Settings file ${settingsFilePath}`, settingsRaw)
    fs.writeFileSync(settingsFilePath, settingsRaw, 'utf8')
}

if(fs.existsSync(settingsFilePath)) {
    const settingsRaw = fs.readFileSync(settingsFilePath, 'utf8')
    const settingsNew = JSON.parse(settingsRaw)
    setSettings(settingsNew)
}