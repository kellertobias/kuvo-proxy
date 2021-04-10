import fs from 'fs'
import path from 'path'

import sudo from 'sudo-prompt'

export const setupSystem = async () => {
    const sslGlobalConfigBlock = `
    [ v3_ca ]
    basicConstraints = critical,CA:TRUE
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid:always,issuer:always
    `

    const globalHostsFile = '/etc/hosts'
    const currentHostsFile = fs.readFileSync(globalHostsFile, {encoding: 'utf8'})
    
    const globalOpenSSLConfigFile = '/etc/ssl/openssl.cnf'
    const currentOpenSSLConfig = fs.readFileSync(globalOpenSSLConfigFile, {encoding: 'utf8'})

    const setupSSL = !currentOpenSSLConfig.includes('v3_ca')
    const setupHOSTS = !currentHostsFile.includes('kuvo.com')
    
    const command = [
        setupSSL ? `echo "${sslGlobalConfigBlock}" >> ${globalOpenSSLConfigFile}` : false,
        setupHOSTS ? `echo "127.0.0.1    kuvo.com" >> ${globalHostsFile}` : false,
    ].filter(x => x).join(' && ')
    
    console.log("Executing Command:", command)
    if(!command) {
        return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
        sudo.exec(command, {name: 'KUVO Setup'}, (err, stdout, stderr) => {
            if(err) return reject(err)
            return resolve(stdout)
        })
    })

}