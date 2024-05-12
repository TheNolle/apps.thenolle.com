import { dialog } from './dialog.js'

/**
 * @description Encrypts a string using a passphrase
 * @param {string} string - The string to encrypt
 * @param {string} passphrase - The passphrase to use for encryption
 * @returns {string} - The encrypted string
 * 
 * @example
 * encryptString('Hello, World!', 'password123')
 */
export function encryptString(string, passphrase) {
    return CryptoJS.AES.encrypt(string, passphrase).toString()
}

/**
 * @description Decrypts a string using a passphrase
 * @param {string} cypherString - The string to decrypt
 * @param {string} passphrase - The passphrase to use for decryption
 * @returns {string} - The decrypted string
 * 
 * @example
 * decryptString('U2FsdGVkX1+a1u2rz4JajKwZDNKzZgfUcHNlcBPQsoI=', 'password123')
 */
export function decryptString(cypherString, passphrase) {
    let bytes = null
    try {
        bytes = CryptoJS.AES.decrypt(cypherString, passphrase)
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8)
        if (!decryptedText) throw new Error('Failed to decrypt')
        return decryptedText
    } catch (error) {
        // tells there was an error, either the passphrase was modified or the data was corrupted
        // propose them to reset the app storage and start over
        // if they accept and enter "reset" then reset the app storage and reload the page
        // if they decline then show another dialog telling them that the app is not usable without the correct passphrase and to reset the app storage and reload the page
        // if they accept and enter "reset" then reset the app storage and reload the page
        // else just tell them that the app is not usable without the correct passphrase and to reset the app storage and reload the page and it is not possible to use the app without the correct passphrase
        dialog.prompt({
            title: 'Encryption Error',
            message: 'The passphrase was modified or the data was corrupted. Do you want to reset the app storage and start over? If yes, enter "reset" and click OK.',
            defaultValue: 'reset',
            onConfirm: (value) => {
                setTimeout(() => {
                    if (value === 'reset') {
                        localStorage.clear()
                        window.location.reload()
                    } else {
                        dialog.show({
                            title: 'Encryption Error',
                            message: 'The app is not usable without the correct passphrase. Please reset the app storage and reload the page.'
                        })
                    }
                }, 100)
            },
            onCancel: () => {
                setTimeout(() => {
                    dialog.show({
                        title: 'Encryption Error',
                        message: 'The app is not usable without the correct passphrase. Please reset the app storage and reload the page.'
                    })
                }, 100)
            }
        })
        return null
    }
}

/**
 * @description Generates a random passphrase
 * @returns {string} - The random passphrase
 * 
 * @example
 * generatePassphrase()
 */
export function generatePassphrase() {
    return CryptoJS.lib.WordArray.random(128 / 8).toString()
}

/**
 * @description The passphrase to use for encryption and decryption
 * @type {string} passphrase - The passphrase
 */
export const passphrase = getPassphrase() || generatePassphrase()
setPassphrase(passphrase)

/**
 * @description Set the passphrase for the database
 * @param {string} passphrase - The passphrase to set
 * 
 * @example
 * setPassphrase('myPassphrase')
 */
function setPassphrase(passphrase) {
    localStorage.setItem('passphrase', passphrase)
}

/**
 * @description Set the passphrase for the database
 * @param {string} passphrase - The passphrase to set
 * @returns {string} - The passphrase set
 * 
 * @example
 * setPassphrase('myPassphrase')
 * console.log(getPassphrase())
 */
function getPassphrase() {
    return localStorage.getItem('passphrase')
}