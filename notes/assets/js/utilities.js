import { clearNotes } from './database.js'
import { dialog } from './dialog.js'

/**
 * @description Generate a random UUID
 * @returns {string} A random UUID
 * 
 * @example
 * const id = randomUUID()
 * console.log(id)
 */
export function randomUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

/**
 * @description Format a date string to a human-readable format
 * @param {string} date - The date string
 * @returns {string} The human-readable date string
 * 
 * @example
 * const date = formatDate('1710281072529')
 * console.log(date)
 */
export function formatDateFromMS(date) {
    const d = new Date(date)
    const options = {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'UTC'
    }
    return d.toLocaleString(navigator.language, options)
}

/**
 * @description Handle encryption errors
 * Sends an alert to the user and prompts them to reset the application data
 * 
 * @example
 * handleEncryptionError()
 */
export function handleEncryptionError() {
    console.error('An error occurred while processing your data. This may be due to an incorrect passphrase or corrupted data.')
    dialog.show({
        title: 'Encryption Error',
        message: 'Unable to process data correctly. Would you like to reset the application data? WARNING: This will delete all existing notes.',
        onConfirm: () => {
            clearNotes()
            setTimeout(() => {
                console.log('Data has been reset')
                dialog.show({
                    title: 'Reset Complete',
                    message: 'Data has been reset. Please refresh the page to continue.',
                    onConfirm: () => location.reload(),
                    onCancel: null
                })
            }, 100)
        },
        onCancel: () => {
            setTimeout(() => {
                console.log('User cancelled the reset')
                dialog.show({
                    title: 'Action Required',
                    message: 'Please discard your current changes to restore application functionality.',
                    onConfirm: null,
                    onCancel: null
                })
            }, 100)
        }
    })
}

/**
 * @description Safely parse a JSON string
 * @param {string} jsonString - The JSON string to parse
 * @returns {Object} - The parsed JSON object
 * 
 * @example
 * const jsonString = '{"name": "John"}'
 * const jsonObject = safeJsonParse(jsonString)
 * console.log(jsonObject.name)
 */
export function safeJsonParse(jsonString) {
    try {
        return JSON.parse(jsonString)
    } catch (error) {
        console.error('Failed to parse JSON:', error)
        handleEncryptionError()
        return null
    }
}