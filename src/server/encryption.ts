import fs from 'fs'
import path from 'path'
import { CertificateStore } from '../types/certificate';


// openssl genrsa -aes256 -out ca-key.pem 2048
// openssl req -x509 -new -nodes -extensions v3_ca -key ca-key.pem -days 1024 -out ca-root.pem -sha512
// openssl genrsa -out zertifikat-key.pem 4096
// openssl req -new -key zertifikat-key.pem -out zertifikat.csr -sha512 -config req.conf
// openssl x509 -req -in zertifikat.csr -CA ca-root.pem -CAkey ca-key.pem -CAcreateserial -out zertifikat-pub.pem -days 365 -sha512 -extensions v3_req -extfile req.conf


export const loadKeys = () => {
    const data = {
        key: fs.readFileSync(path.join(__dirname, '../../static/zertifikat-key.pem'), 'utf8'),
        cert: fs.readFileSync(path.join(__dirname, '../../static/zertifikat-pub.pem'), 'utf8'),
    }
    return data

}


export const createOrLoadKeys = (): Promise<CertificateStore> => {
    // if(process.env.RENEW && fs.existsSync(certificateDataPath)) {
    //     console.log("SSL Cleanup")
    //     fs.unlinkSync(certificateDataPath)
    // }
    // if(fs.existsSync(certificateDataPath)) {
        console.log("SSL Setup Load")
        return Promise.resolve(loadKeys())
    // } else {
    //     console.log("SSL Setup Generate")
    //     return createKeys()
    // }
}