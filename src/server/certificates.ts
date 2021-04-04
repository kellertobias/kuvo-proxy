import fs from 'fs'
import path from 'path'
import electron from 'electron';
import {customAlphabet} from 'nanoid'
import { execSync } from 'child_process';
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 16)
const dataPath = electron.app.getPath('userData');
export const certFolder = path.join(dataPath, 'certs');

export const certificateNames = {
    ca: 'kuvo-ca-root.pem',
    caKey: 'ca-key.pem',
    key: 'server-key.pem',
    cert: 'server-cert.pem',
    csr: 'server.csr'
}

console.log("[SSL] Certificates Loaded")

const openssl = (
    stepName: string,
    action: 'genrsa' | 'req' | 'x509',
    options: {
        params: Record<string, string | number | boolean | string[]>,
        file?: Record<string, any>,
        passIn?: string,
        passOut?: string,
    }
) => {
    const {params, file, passIn, passOut} = options
    const paramString = Object.keys(params).map((key) => {
        const value = params[key]
        if(key.startsWith('_')) {
            return value
        }
        
        if(typeof value === 'boolean') {
            return value ? `-${key}` : ''
        }
        
        if(Array.isArray(value)) {
            return `-${key} ${value.join(' ')}`    
        }

        return `-${key} ${value}`
    })

    const configFiles = Object.keys(file || {}).map((key) => {
        const config = file[key]
        const fileName = `${stepName}-${key}.conf`

        const content = Object.keys(config).map(block => {
            const blockContent = config[block]
            const blockString = Object.keys(blockContent).map(variable => {
                const variableValue = blockContent[variable]
                if(typeof variableValue === 'undefined') {
                    return `${variable}`
                }
                if(Array.isArray(variableValue)) {
                    return `${variable} = ${variableValue.join(', ')}`
                }
                return `${variable} = ${variableValue}`
            }).join('\n')
            return `[${block}]\n${blockString}`
        }).join('\n\n');

        fs.writeFileSync(path.join(certFolder, fileName), content, 'utf8')
        console.log("")
        console.log(`File: ${fileName}`)
        console.log("-------------")
        console.log(content)
        console.log("-------------")
        console.log("")

        return `-${key} ${fileName}`
    })
    
    const args = [
        action,
        passIn ? `-passin pass:${passIn}` : '',
        passOut ? `-passout pass:${passOut}` : '',
        ...paramString,
        ...configFiles
    ].filter(x => x !== '')

    const command = `openssl ${args.join(' ')}`

    console.log(`[SSL][EXEC] (${stepName}) openssl with `, args)
    console.log(command)
    execSync(command, {
        cwd: certFolder
    })
    console.log("[SSL] openssl done.")
}

export const generateKeys = (): Promise<void> => {
    const certificatePassword = nanoid()
    // openssl genrsa -aes256 -out ca-key.pem 2048
    openssl('ca-key', 'genrsa', {
        params: {
            aes256: true,
            out: certificateNames.caKey,
            _: 2048
        },
        passOut: certificatePassword
    })

    // openssl req -x509 -new -nodes -extensions v3_ca -key ca-key.pem -days 1024 -out ca-root.pem -sha512
    openssl('ca-cert', 'req', {
        params: {
            x509: true,
            new: true,
            subj: '/C=DE/ST=HE/L=Darmstadt/O=Tobisk\\ Media/CN=kuvo.com',
            nodes: true,
            extensions: ['v3_ca'],
            key: certificateNames.caKey,
            days: 3650,
            out: certificateNames.ca,
            sha512: true
        },
        passIn: certificatePassword
    })

    // openssl genrsa -out zertifikat-key.pem 4096
    openssl('server-key', 'genrsa', {
        params: {
            out: certificateNames.key,
            _: 4096
        }
    })

    const serverCsrConf = {
        req: {
            distinguished_name: 'req_distinguished_name',
            req_extensions: 'v3_req',
            prompt: 'no'
        },
        req_distinguished_name: {
            C: 'DE',
            ST: 'HE',
            L: 'Darmstadt',
            O: 'Tobisk Media',
            OU: 'Software',
            CN: 'kuvo.com'
        },
        v3_req: {
            basicConstraints: 'CA:FALSE',
            keyUsage: ['keyEncipherment', 'dataEncipherment', 'nonRepudiation', 'digitalSignature'],
            extendedKeyUsage: 'serverAuth',
            subjectAltName: '@alt_names',
        },
        alt_names: {
            'DNS.1': 'kuvo.com',
            'DNS.2': 'www.kuvo.com',
            'DNS.3': 'api.kuvo.com',
            'DNS.4': 'localhost',
        }
    }

    // openssl req -new -key zertifikat-key.pem -out zertifikat.csr -sha512 -config req.conf
    openssl('server-csr', 'req', {
        params: {
            new: true,
            key: certificateNames.key,
            out: certificateNames.csr,
            sha512: true
        },
        file: {
            config: serverCsrConf
        }
    })

    // openssl x509 -req -in zertifikat.csr -CA ca-root.pem -CAkey ca-key.pem -CAcreateserial \
    //              -out zertifikat-pub.pem -days 365 -sha512 -extensions v3_req -extfile req.conf
    openssl('server-cert', 'x509', {
        params: {
            req: true,
            in: certificateNames.csr,
            CA: certificateNames.ca,
            CAkey: certificateNames.caKey,
            CAcreateserial: true,
            out: certificateNames.cert,
            days: 365,
            sha512: true,
            extensions: ['v3_req'],
        },
        passIn: certificatePassword,
        file: {
            extfile: serverCsrConf
        }
    })

    return Promise.resolve()
}