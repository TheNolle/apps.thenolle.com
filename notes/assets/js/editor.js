import * as Exports from './exports.js'
import { getNoteById, updateNote } from './database.js'
import { dialog } from './dialog.js'
import { alert } from './alert.js'
import { getQuillInstance } from './sidebar.js'

/**
 * @description Initializes the editor
 */
export function initEditor() {
    Exports.Elements.editorContainer.addEventListener('input', handleInput)
    Exports.Elements.editorContainer.addEventListener('keydown', handleKeyDown)
    window.addEventListener('beforeunload', handleBeforeUnload)
    loadInitialNote()
}

/**
 * @description Handles input in the editor
 * @param {InputEvent} event - The event that triggered the input
 */
function handleInput(event) {
    changeTitle()
}

/**
 * @description Handles keydown events in the editor
 * @param {KeyboardEvent} event - The event that triggered the keydown
 */
function handleKeyDown(event) {
    const noteId = Exports.Elements.previewContainer.querySelector('.note-card.active').dataset.id
    const noteContent = getQuillInstance().getContents()

    if (event.ctrlKey && event.key === 's') saveNote(event, noteId)
    else if (event.key === 'F2') {
        event.preventDefault()
        const noteId = Exports.Elements.previewContainer.querySelector('.note-card.active').dataset.id
        renameNote(noteId)
    } else if (event.key === 'Tab') {
        event.preventDefault()
        document.execCommand('insertText', false, '    ')
    }
}

/**
 * @description Handles the beforeunload event
 * @param {BeforeUnloadEvent} event - The event that triggered the beforeunload
 */
function handleBeforeUnload(event) {
    if (Exports.Elements.editorContainer.dataset.currentlyEditing === 'true') event.preventDefault()
}

/**
 * @description Loads the initial note
 */
function loadInitialNote() {
    Exports.Elements.editorContainer.dataset.currentlyEditing = false
    Exports.Elements.editorContainer.dataset.noteTitle = ''
    Exports.Elements.editorContainer.innerHTML = ''

    const activeNote = Exports.Elements.previewContainer.querySelector('.note-card.active')
    if (activeNote) {
        const noteId = activeNote.dataset.id
        const note = getNoteById(noteId)
        Exports.Elements.editorContainer.dataset.noteTitle = note.title
        Exports.Elements.editorContainer.dataset.currentlyEditing = false
        getQuillInstance().setContents(note.content)
    }
}

/**
 * @description Changes the title of the editor
 */
function changeTitle() {
    const noteId = Exports.Elements.previewContainer.querySelector('.note-card.active').dataset.id
    const note = getNoteById(noteId)
    Exports.Elements.editorContainer.dataset.currentlyEditing = note.content !== getQuillInstance().getContents()
}

/**
 * @description Handles saving the note
 * @param {Event} event - The event that triggered the save
 * @param {string} noteId - The ID of the note
 */
export function saveNote(event, noteId) {
    event.preventDefault()
    const note = getNoteById(noteId)
    const noteTitle = note.title
    updateNote({ id: noteId, title: noteTitle, content: JSON.stringify(getQuillInstance().getContents()) })
    changeTitle()
    Exports.Elements.editorContainer.dataset.currentlyEditing = false
}

/**
 * @description Handles renaming the note
 * @param {string} noteId - The ID of the note
 */
export function renameNote(noteId) {
    const note = getNoteById(noteId)
    dialog.prompt({
        title: 'Rename Note',
        message: 'Enter a new title for the note:',
        defaultValue: note.title,
        onConfirm: newTitle => {
            if (!newTitle || !newTitle.trim())
                return alert.warning({ message: 'Note title cannot be empty!' })
            if (newTitle.length > 50)
                return alert.warning({ message: 'Note title cannot exceed 50 characters!' })
            Exports.Elements.previewContainer.querySelector(`.note-card[data-id="${noteId}"] h3`).textContent = newTitle
            Exports.Elements.editorContainer.dataset.noteTitle = newTitle
            updateNote({ id: noteId, title: newTitle, content: note.content })
            changeTitle()
        }
    })
}