import { Decks } from '../backend/decks';
import { settings } from '../server/settings';
import fs from 'fs'
import os from 'os'
import axios from 'axios'

/**
 * Resolves paths that start with a tilde to the user's home directory.
 *
 * @param  {string} filePath '~/GitHub/Repo/file.png'
 * @return {string}          '/home/bob/GitHub/Repo/file.png'
 */
 function resolveTilde (filePath: string) {
    if (!filePath || typeof(filePath) !== 'string') {
      return '';
    }
  
    // '~/folder/path' or '~' not '~alias/folder/path'
    if (filePath.startsWith('~/') || filePath === '~') {
      return filePath.replace('~', os.homedir());
    }
  
    return filePath;
  }

Decks.registerCallback((decks) => {
    if(!settings.callbackPath) {
        console.log("No External API or File Path configured. Not Updating External Sources.")
        return
    }

    if(settings.callbackPath.startsWith('http')) {
        const protocol = settings.callbackPath.startsWith('https') ? 'https' : 'http'
        console.log("Calling external Rest API", settings.callbackPath, protocol)
        const tracks = decks.playlist.slice(0, 5).map(track => {
          return `${track.title} (${track.artist})`
        })

        axios.post(settings.callbackPath, {lines: tracks}).then(() => {
          console.log("SENT")
        }).catch((err) => {
          console.log("COULD NOT SEND", err.toString())
        })
        return
    }

    if(settings.callbackPath.startsWith('/') || settings.callbackPath.startsWith('~/')) {
        const filePath = resolveTilde(settings.callbackPath)
        console.log("Writing file", filePath)
        const data = decks.playlist.map(track => {
            return `${track.title} (${track.artist})`
        }).join('\n')
        fs.writeFileSync(filePath, data, 'utf8')
        return
    }

    console.log(`No Handler for the format of your Callback Path: ${settings.callbackPath}`)
})