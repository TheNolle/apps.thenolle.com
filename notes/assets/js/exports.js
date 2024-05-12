export const Elements = {
    /**
     * @description The container for note previews
     * @type {HTMLUListElement} previewContainer - The container for note previews
     */
    previewContainer: document.querySelector('body > main > aside > ul.preview-container'),

    /**
     * @description The container for action buttons
     * @type {HTMLDivElement} actionContainer - The container for action buttons
     */
    actionContainer: document.querySelector('body > main > aside > div.action-container'),

    /**
     * @description The new note button
     * @type {HTMLButtonElement} newNote - The new note button
     */
    newNote: document.querySelector('body > main > aside > div.action-container > button.action.new-note'),

    /**
     * @description The search/sort notes container
     * @type {HTMLDivElement} searchSortContainer - The search notes container
     */
    searchSortContainer: document.querySelector('body > main > aside > div.action-container > div.search-sort-container'),

    /**
     * @description The search notes input
     * @type {HTMLInputElement} searchNotes - The search notes input
     */
    searchNotes: document.querySelector('body > main > aside > div.action-container > div.search-sort-container > input'),

    /**
     * @description The sort notes select
     * @type {HTMLSelectElement} sortNotes - The sort notes select
     */
    sortNotes: document.querySelector('body > main > aside > div.action-container > div.search-sort-container > select'),

    /**
     * @description The delete note button
     * @type {HTMLButtonElement} deleteNote - The delete note button
     */
    deleteNote: document.querySelector('body > main > aside > div.action-container > button.action.delete-note'),

    /**
     * @description The container for the note editor
     * @type {HTMLDivElement} editorContainer - The container for the note editor
     */
    editorContainer: document.querySelector('body > main > div.editor-container'),
}