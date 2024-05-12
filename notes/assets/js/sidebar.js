import { getNotes, getNoteById, createNote, deleteNoteById, sortNotes } from './database.js'
import { formatDateFromMS } from './utilities.js'
import * as Exports from './exports.js'
import { dialog } from './dialog.js'
import { alert } from './alert.js'

/**
 * @description Initializes the sidebar
 */
export function initSidebar() {
    if (getNotes().length) {
        const sortedNotes = sortNotes(getNotes())
        sortedNotes.forEach(note => Exports.Elements.previewContainer.appendChild(createNoteCard(note)))
    } else Exports.Elements.previewContainer.appendChild(createNoteCard({ title: 'No Notes Yet!' }))

    Exports.Elements.previewContainer.addEventListener('click', handleClick)
    Exports.Elements.newNote.addEventListener('click', createNewNote)
    Exports.Elements.deleteNote.addEventListener('click', () => deleteNote(Exports.Elements.previewContainer.querySelector('.note-card.active')))

    Exports.Elements.searchNotes.addEventListener('input', handleInput)
    Exports.Elements.sortNotes.addEventListener('change', handleSelect)
}

/**
 * @description Handles click events on the sidebar
 * @param {MouseEvent} event - The click event
 */
function handleClick(event) {
    const noteCard = event.target.closest('li.note-card')
    if (noteCard && Exports.Elements.previewContainer.contains(noteCard)) handleNoteCardClick(noteCard)
}

/**
 * @description Handles input events on the sidebar
 * @param {InputEvent} event - The input event
 */
function handleInput(event) {
    const searchTerm = event.target.value.toLowerCase()
    const notesToDisplay = getNotes().filter(note => note.title.toLowerCase().includes(searchTerm))
    renderNotes(notesToDisplay)
}

/**
 * @description Handles select events on the sidebar
 * @param {InputEvent} event - The select event
 */
function handleSelect(event) {
    const sortValue = event.target.value
    const sortedNotes = sortNotes(getNotes(), sortValue)
    renderNotes(sortedNotes)
}

/**
 * @description Renders the notes in the preview container
 * @param {Note[]} notes - The notes to render
 */
function renderNotes(notes) {
    Exports.Elements.previewContainer.innerHTML = ''
    if (notes.length) notes.forEach(note => Exports.Elements.previewContainer.appendChild(createNoteCard(note)))
    else Exports.Elements.previewContainer.appendChild(createNoteCard({ title: 'No matching notes!' }))
}

let quillInstance = null

/**
 * @description Handles click events on note cards
 * @param {HTMLElement} noteCard - The note card that was clicked
 */
function handleNoteCardClick(noteCard) {
    if (Exports.Elements.editorContainer.dataset.currentlyEditing === 'true')
        return alert.warning({ message: 'Please save or cancel the current note before switching to another note!' })
    if (noteCard.classList.contains('active')) {
        noteCard.classList.remove('active')
        Exports.Elements.editorContainer.dataset.noteTitle = ''
        Exports.Elements.editorContainer.dataset.currentlyEditing = false
        Exports.Elements.editorContainer.innerHTML = ''
        return
    }
    Exports.Elements.previewContainer.querySelectorAll('.note-card').forEach(card => card.classList.remove('active'))
    noteCard.classList.add('active')
    const note = getNoteById(noteCard.dataset.id)
    Exports.Elements.editorContainer.dataset.noteTitle = note.title
    Exports.Elements.editorContainer.dataset.currentlyEditing = false
    Exports.Elements.editorContainer.innerHTML = ''

    const quillEditor = document.createElement('div')
    quillEditor.id = 'quill-editor'
    Exports.Elements.editorContainer.appendChild(quillEditor)
    quillInstance = new Quill(quillEditor, {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [false, 6, 5, 4, 3, 2, 1] }, { size: [] }, { 'align': [] }],
                ['font', 'bold', 'italic', 'underline', 'strike', 'blockquote'],
                ['color', 'background'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                ['link', 'image', 'video', 'code'],
                ['clean']
            ]
        }
    })
    if (typeof note.content === 'string')
        quillInstance.setContents(JSON.parse(note.content))
    else quillInstance.setText(note.content)
}

/**
 * @description Gets the Quill instance
 * @returns {Quill} The Quill instance
 */
export function getQuillInstance() {
    return quillInstance
}

/**
 * @description Creates a new note
 */
export function createNewNote() {
    if (Exports.Elements.editorContainer.dataset.currentlyEditing === 'true')
        return alert.warning({ message: 'Please save or cancel the current note before creating a new note!' })
    dialog.prompt({
        title: 'New Note',
        message: 'Enter a title for the new note:',
        defaultValue: 'New Note',
        onConfirm: (noteTitle) => {
            setTimeout(() => {
                if (!noteTitle || !noteTitle.trim())
                    return alert.warning({ message: 'Note title cannot be empty!' })
                if (noteTitle.length > 50)
                    return alert.warning({ message: 'Note title cannot be longer than 50 characters!' })
                const note = createNote({ title: noteTitle, content: '' })
                const noteCard = createNoteCard(note)
                Exports.Elements.previewContainer.querySelector('.note-card.empty')?.remove()
                Exports.Elements.previewContainer.appendChild(noteCard)
                handleNoteCardClick(noteCard)
            }, 100)
        },
        onCancel: () => console.log('New note creation was cancelled.')
    })
}

/**
 * @description Deletes the active note
 * @param {HTMLElement} noteCard - The note card to delete
 */
export function deleteNote(noteCard) {
    const note = getNoteById(noteCard.dataset.id)
    dialog.show({
        title: 'Delete Note',
        message: `Are you sure you want to delete the note "${note.title}"?`,
        onConfirm: () => {
            deleteNoteById(note.id)
            noteCard.remove()
            if (!Exports.Elements.previewContainer.querySelector('.note-card')) Exports.Elements.previewContainer.appendChild(createNoteCard({ title: 'No Notes Yet!' }))
            Exports.Elements.editorContainer.dataset.noteTitle = ''
            Exports.Elements.editorContainer.dataset.currentlyEditing = false
            Exports.Elements.editorContainer.innerHTML = ''
            alert.success({ message: 'Note deleted successfully!' })
        },
        onCancel: () => console.log('Note deletion was cancelled.')
    })
}

/**
 * @description Create a new note card element
 * @param {Object} note - The note object
 * @param {string} note.id - The note ID
 * @param {string} note.title - The note title
 * @param {string} note.content - The note content
 * @param {string} note.lastEditTime - The last edit time of the note
 * @param {boolean} note.isActive - The active state of the note
 * @returns {HTMLElement} The note card element
 * 
 * @example
 * const note = getNoteById('123')
 * const noteCard = createNoteCard(note)
 * console.log(noteCard)
 */
export function createNoteCard(note) {
    const li = document.createElement('li')
    if (note.id) li.dataset.id = note.id
    li.classList.add('note-card')
    if (note.isActive) li.classList.add('active')

    const h3 = document.createElement('h3')
    h3.textContent = note.title
    li.appendChild(h3)

    if (note.lastEditTime) {
        const time = document.createElement('time')
        time.textContent = formatDateFromMS(note.lastEditTime)
        li.appendChild(time)
    } else li.classList.add('empty')

    return li
}