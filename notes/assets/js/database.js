import { handleEncryptionError, randomUUID, safeJsonParse } from './utilities.js'
import { encryptString, decryptString, passphrase } from './encryption.js'
import { alert } from './alert.js'

/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} lastEditTime
 * @property {string} creationTime
 */

/**
 * @description Get all notes from the database
 * @returns {Note[]}
 * 
 * @example
 * const notes = getNotes()
 * notes.forEach(note => {
 *    console.log(note.title)
 * })
 */
export function getNotes() {
    try {
        const encryptedNotes = localStorage.getItem('notes')
        if (!encryptedNotes) return []
        const notesJson = decryptString(encryptedNotes, passphrase)
        const notes = safeJsonParse(notesJson)
        return notes || []
    } catch (error) {
        handleEncryptionError()
        return []
    }
}

/**
 * @description Get a note by its id
 * @param {string} id - The id of the note
 * @returns {Note}
 * 
 * @example
 * const note = getNoteById('123')
 * console.log(note.title)
 * console.log(note.content)
 * console.log(note.lastEditTime)
 */
export function getNoteById(id) {
    const notes = getNotes()
    return notes.find(note => note.id === id)
}

/**
 * @description Sort notes by a specific property
 * @param {Note[]} notes - The notes to sort
 * @param {'lastEdited' | 'creationTime1' | 'creationTime2' | 'title'} sortBy - The property to sort by
 * @returns {Note[]}
 * 
 * @example
 * const notes = getNotes()
 * const sortedNotes = sortNotes(notes, 'lastEdited')
 * sortedNotes.forEach(note => console.log(note.title))
 */
export function sortNotes(notes, sortBy = 'lastEdited') {
    switch (sortBy) {
        case 'creationTime1':
            return notes.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime))
        case 'creationTime2':
            return notes.sort((a, b) => new Date(a.creationTime) - new Date(b.creationTime))
        case 'title':
            return notes.sort((a, b) => a.title.localeCompare(b.title))
        case 'lastEdited':
        default:
            return notes.sort((a, b) => new Date(b.lastEditTime) - new Date(a.lastEditTime))
    }
}

/**
 * @description Create a new note
 * @param {Object} note - The note object
 * @param {string} note.title - The title of the note
 * @param {string} note.content - The content of the note
 * @returns {Note}
 * 
 * @example
 * createNote({
 *   title: 'My note',
 *  content: 'This is the content of my note'
 * })
 */
export function createNote({ title, content }) {
    try {
        const notes = getNotes()
        const newNote = { id: randomUUID(), title, content, lastEditTime: new Date().toISOString(), creationTime: new Date().toISOString() }
        notes.push(newNote)
        const encryptedNotes = encryptString(JSON.stringify(notes), passphrase)
        localStorage.setItem('notes', encryptedNotes)
        alert.success({ message: `Note "${title}" created` })
        return newNote
    } catch (error) {
        handleEncryptionError()
        return null
    }
}

/**
 * @description Update a note
 * @param {Object} note - The note object
 * @param {string} note.id - The id of the note
 * @param {string} note.title - The title of the note
 * @param {string} note.content - The content of the note
 * 
 * @example
 * updateNote({
 *  id: '123',
 *  title: 'My updated note',
 *  content: 'This is the updated content of my note'
 * })
 */
export function updateNote({ id, title, content }) {
    try {
        const notes = getNotes()
        const noteIndex = notes.findIndex(note => note.id === id)
        if (noteIndex === -1) return
        notes[noteIndex] = { ...notes[noteIndex], title, content, lastEditTime: new Date().toISOString() }
        const encryptedNotes = encryptString(JSON.stringify(notes), passphrase)
        localStorage.setItem('notes', encryptedNotes)
        alert.info({ message: `Note "${title}" updated` })
    } catch (error) {
        handleEncryptionError()
    }
}

/**
 * @description Delete a note by its id
 * @param {string} id - The id of the note
 * 
 * @example
 * deleteNote('123')
 */
export function deleteNoteById(id) {
    try {
        const notes = getNotes()
        const newNotes = notes.filter(note => note.id !== id)
        const encryptedNotes = encryptString(JSON.stringify(newNotes), passphrase)
        localStorage.setItem('notes', encryptedNotes)
        alert.warning({ message: 'Note deleted' })
    } catch (error) {
        handleEncryptionError()
    }
}

/**
 * @description Clear all notes from the database
 * 
 * @example
 * clearNotes()
 */
export function clearNotes() {
    localStorage.removeItem('notes')
    localStorage.removeItem('passphrase')
    alert.error({ message: 'All notes have been cleared' })
}