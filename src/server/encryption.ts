import fs from 'fs'
import path from 'path'
import rimraf from 'rimraf'

import { CertificateStore } from '../types/certificate';

import { certFolder, generateKeys, certificateNames } from './certificates';

export const loadKeys = (): CertificateStore => {
    const data = {
        key: fs.readFileSync(path.join(certFolder, certificateNames.key), 'utf8'),
        cert: fs.readFileSync(path.join(certFolder, certificateNames.cert), 'utf8'),
        ca: fs.readFileSync(path.join(certFolder, certificateNames.ca), 'utf8'),
    }

    console.log("[SSL] Certificates Loaded")
    return data
}


export const createOrLoadKeys = async (): Promise<CertificateStore> => {
    console.log("[SSL] SSL Setup Initiated")
    if(process.env.RENEW && fs.existsSync(certFolder)) {
        console.log("[SSL] Cleanup requested")
        rimraf.sync(certFolder)
    }
    if(!fs.existsSync(certFolder)) {
        console.log("[SSL] Creation Initiated")
        fs.mkdirSync(certFolder)
        await generateKeys()
    }
    
    return Promise.resolve(loadKeys())
}