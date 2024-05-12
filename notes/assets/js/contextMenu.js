import * as Exports from './exports.js'
import { getNoteById } from './database.js'
import { renameNote, saveNote } from './editor.js'
import { createNewNote, deleteNote, getQuillInstance } from './sidebar.js'

/**
 * @description Initializes the context menu
 */
export function initContextMenu() {
    window.addEventListener('click', handleClick)
    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('scroll', closeContextMenu)
    window.addEventListener('resize', closeContextMenu)
    window.addEventListener('blur', closeContextMenu)
    window.addEventListener('keydown', event => {
        if (event.ctrlKey && event.key === 'p') {
            event.preventDefault()
            return createNewNote()
        } else if (event.key === 'Escape') {
            return closeContextMenu()
        } else if (event.key === 'F2') {
            if (document.querySelector('.note-card.active'))
                return renameNote(document.querySelector('.note-card.active').dataset.id)
            return
        } else if (event.ctrlKey && event.key === 'Delete') {
            event.preventDefault()
            if (document.querySelector('.note-card.active') && Exports.Elements.editorContainer.contentEditable === 'true')
                return deleteNote(document.querySelector('.note-card.active'))
            return
        } else if (event.ctrlKey && event.key === 'd') {
            event.preventDefault()
            if (document.querySelector('.note-card.active'))
                return downloadNote(document.querySelector('.note-card.active').dataset.id)
            return
        }
    })
}

/**
 * @description Handles context menu events
 * @param {MouseEvent} event - The context menu event
 */
function handleContextMenu(event) {
    event.preventDefault()
    closeContextMenu()
    document.body.appendChild(createContextMenu(event))
}

/**
 * @description Closes the context menu
 * @param {MouseEvent} event - The click event
 */
function handleClick(event) {
    closeContextMenu()
}

/**
 * @description Closes the context menu
 * @param {MouseEvent} event - The click event
 * @returns {HTMLElement} The context menu
 */
function createContextMenu(event) {
    const contextMenu = document.createElement('ul')
    contextMenu.classList.add('context-menu')
    contextMenu.style.top = `${event.clientY}px`
    contextMenu.style.left = event.clientX + 224 > window.innerWidth ? `${event.clientX - 224}px` : `${event.clientX}px`


    const links = document.createElement('li')
    links.classList.add('context-menu-item', 'links')
    contextMenu.appendChild(links)

    const discordLink = document.createElement('a')
    discordLink.href = 'https://discord.com/invite/Fp5vyeJCZF'
    discordLink.target = '_blank'
    discordLink.rel = 'noopener'
    discordLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/></svg>`
    discordLink.addEventListener('click', event => event.stopPropagation())
    links.appendChild(discordLink)

    const patreonLink = document.createElement('a')
    patreonLink.href = 'https://patreon.com/_nolly'
    patreonLink.target = '_blank'
    patreonLink.rel = 'noopener'
    patreonLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M489.7 153.8c-.1-65.4-51-119-110.7-138.3C304.8-8.5 207-5 136.1 28.4C50.3 68.9 23.3 157.7 22.3 246.2C21.5 319 28.7 510.6 136.9 512c80.3 1 92.3-102.5 129.5-152.3c26.4-35.5 60.5-45.5 102.4-55.9c72-17.8 121.1-74.7 121-150z"/></svg>`
    patreonLink.addEventListener('click', event => event.stopPropagation())
    links.appendChild(patreonLink)

    const githubLink = document.createElement('a')
    githubLink.href = 'https://twitter.com/thenolly_'
    githubLink.target = '_blank'
    githubLink.rel = 'noopener'
    githubLink.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>`
    githubLink.addEventListener('click', event => event.stopPropagation())
    links.appendChild(githubLink)


    const newNoteButton = document.createElement('li')
    newNoteButton.classList.add('context-menu-item')
    newNoteButton.textContent = 'New Note (Ctrl + P)'
    newNoteButton.addEventListener('click', () => createNewNote())
    contextMenu.appendChild(newNoteButton)

    if (event.target.closest('li.note-card')) {
        const separator = document.createElement('li')
        separator.classList.add('context-menu-item', 'separator')
        contextMenu.appendChild(separator)

        const renameButton = document.createElement('li')
        renameButton.classList.add('context-menu-item')
        renameButton.textContent = 'Rename Note (F2)'
        renameButton.addEventListener('click', () => renameNote(event.target.closest('li.note-card').dataset.id))
        contextMenu.appendChild(renameButton)

        const downloadButton = document.createElement('li')
        downloadButton.classList.add('context-menu-item')
        downloadButton.textContent = 'Download Note (Ctrl + D)'
        downloadButton.addEventListener('click', () => downloadNote(event.target.closest('li.note-card').dataset.id))
        contextMenu.appendChild(downloadButton)

        const deleteButton = document.createElement('li')
        deleteButton.classList.add('context-menu-item')
        deleteButton.textContent = 'Delete Note (Ctrl + Delete)'
        deleteButton.addEventListener('click', () => deleteNote(event.target.closest('li.note-card')))
        contextMenu.appendChild(deleteButton)
    }

    if (Exports.Elements.editorContainer.contentEditable && Exports.Elements.previewContainer.querySelector('.note-card.active')) {
        if (Exports.Elements.editorContainer.dataset.currentlyEditing === 'false' || Exports.Elements.editorContainer.dataset.currentlyEditing === undefined) {
            const downloadButton = document.createElement('li')
            downloadButton.classList.add('context-menu-item')
            downloadButton.textContent = 'Download Note (Ctrl + D)'
            downloadButton.addEventListener('click', () => downloadNote(Exports.Elements.previewContainer.querySelector('.note-card.active').dataset.id))
            contextMenu.appendChild(downloadButton)
        }
    }

    if (Exports.Elements.editorContainer.contentEditable && Exports.Elements.previewContainer.querySelector('.note-card.active')) {
        if (Exports.Elements.editorContainer.dataset.currentlyEditing === 'true') {
            const separator = document.createElement('li')
            separator.classList.add('context-menu-item', 'separator')
            contextMenu.appendChild(separator)

            const saveButton = document.createElement('li')
            saveButton.classList.add('context-menu-item')
            saveButton.textContent = 'Save Note (Ctrl + S)'
            const noteId = Exports.Elements.previewContainer.querySelector('.note-card.active').dataset.id
            saveButton.addEventListener('click', event => saveNote(event, noteId))
            contextMenu.appendChild(saveButton)

            const discardButton = document.createElement('li')
            discardButton.classList.add('context-menu-item')
            discardButton.textContent = 'Discard Changes'
            const note = getNoteById(Exports.Elements.previewContainer.querySelector('.note-card.active').dataset.id)
            discardButton.addEventListener('click', () => {
                getQuillInstance().setContents(note.content)
                saveNote(event, note.id)
            })
            contextMenu.appendChild(discardButton)
        }
    }

    return contextMenu
}

/**
 * @description Downloads the note as a markdown file
 * @param {string} noteId - The note ID
 */
function downloadNote(noteId) {
    const note = getNoteById(noteId)
    if (!note) return
    if (Exports.Elements.editorContainer.dataset.currentlyEditing === 'true') saveNote()
    if (Exports.Elements.editorContainer.dataset.currentlyEditing === 'true') return
    if (note.content === '') return alert.error({ message: 'Cannot download an empty note!' })
    const converter = new QuillDeltaToHtmlConverter(JSON.parse(note.content).ops, {})
    const html = converter.convert()
    const turndownService = new TurndownService()
    const markdown = turndownService.turndown(html)
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = `${note.title.replace(/\s+/g, '_')}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(href)
}

/**
 * @description Closes the context menu
 */
function closeContextMenu() {
    const contextMenu = document.querySelector('.context-menu')
    if (contextMenu) contextMenu.remove()
}