/**
 * @name Dialog
 * @description A dialog class to show a message to the user
 * 
 * @example
 * const dialog = new Dialog()
 * dialog.show({ title: 'Notice', message: 'This is a dialog message' })
 * dialog.hide()
 */
class Dialog {
    constructor() {
        /**
         * @description The dialog container
         * @type {HTMLDivElement} dialogContainer - The dialog container
         * @default null
         */
        this.dialogContainer = null
        /**
         * @description The title element of the dialog
         * @type {HTMLTitleElement} titleElement - The title element of the dialog
         * @default null
         */
        this.titleElement = null
        /**
         * @description The message element of the dialog
         * @type {HTMLParagraphElement} messageElement - The message element of the dialog
         * @default null
         */
        this.messageElement = null
        /**
         * @description The confirm button of the dialog
         * @type {HTMLButtonElement} confirmButton - The confirm button of the dialog
         * @default null
         */
        this.confirmButton = null
        /**
         * @description The cancel button of the dialog
         * @type {HTMLButtonElement} cancelButton - The cancel button of the dialog
         * @default null
         */
        this.cancelButton = null
        /**
         * @description The input element of the dialog
         * @type {HTMLInputElement} inputElement - The input element of the dialog
         * @default null
         */
        this.inputElement = null

        this.initDialog()
    }

    /**
     * @description Initialize the dialog container and its elements
     * 
     * @example
     * initDialog()
     */
    initDialog() {
        const dialogContainer = document.createElement('div')
        dialogContainer.classList.add('dialog-container')
        document.body.appendChild(dialogContainer)
        this.dialogContainer = dialogContainer

        const dialog = document.createElement('div')
        dialog.classList.add('dialog')
        dialogContainer.appendChild(dialog)

        const dialogTitle = document.createElement('h2')
        dialogTitle.classList.add('dialog-title')
        dialogTitle.textContent = 'Notice'
        dialog.appendChild(dialogTitle)
        this.titleElement = dialogTitle

        const dialogMessage = document.createElement('p')
        dialogMessage.classList.add('dialog-message')
        dialogMessage.textContent = 'This is a dialog message'
        dialog.appendChild(dialogMessage)
        this.messageElement = dialogMessage

        const dialogActions = document.createElement('div')
        dialogActions.classList.add('dialog-actions')
        dialog.appendChild(dialogActions)

        const dialogConfirm = document.createElement('button')
        dialogConfirm.classList.add('dialog-confirm')
        dialogConfirm.textContent = 'OK'
        dialogConfirm.addEventListener('click', this.hide.bind(this))
        dialogActions.appendChild(dialogConfirm)
        this.confirmButton = dialogConfirm

        const dialogCancel = document.createElement('button')
        dialogCancel.classList.add('dialog-cancel')
        dialogCancel.textContent = 'Cancel'
        dialogCancel.addEventListener('click', this.hide.bind(this))
        dialogActions.appendChild(dialogCancel)
        this.cancelButton = dialogCancel
    }

    /**
     * @description Show the dialog with a message
     * @param {Object} options - The options object
     * @param {string} options.title - The title of the dialog
     * @param {string} options.message - The message of the dialog
     * @param {Function} options.onConfirm - The callback function when the confirm button is clicked
     * @param {Function} options.onCancel - The callback function when the cancel button is clicked
     * 
     * @example
     * show({ title: 'Notice', message: 'This is a dialog message' })
     */
    show({ title, message, onConfirm, onCancel }) {
        this.titleElement.textContent = title
        this.messageElement.textContent = message
        this.confirmButton.onclick = () => {
            if (onConfirm) onConfirm()
            this.hide()
        }
        this.cancelButton.onclick = () => {
            if (onCancel) onCancel()
            this.hide()
        }
        this.dialogContainer.classList.add('show')
    }

    /**
     * @description Show the dialog with a prompt message
     * @param {Object} options - The options object
     * @param {string} options.title - The title of the dialog
     * @param {string} options.message - The message of the dialog
     * @param {Function} options.onConfirm - The callback function when the confirm button is clicked
     * @param {Function} options.onCancel - The callback function when the cancel button is clicked
     * @param {string} options.defaultValue - The default value of the input
     * 
     * @example
     * prompt({ title: 'Notice', message: 'This is a dialog message', defaultValue: 'Default value' })
     */
    prompt({ title, message, onConfirm, onCancel, defaultValue = '' }) {
        this.titleElement.textContent = title
        this.messageElement.textContent = message

        if (!this.inputElement) {
            const inputElement = document.createElement('input')
            inputElement.classList.add('dialog-input')
            inputElement.type = 'text'
            inputElement.placeholder = 'Enter a value'
            inputElement.autofocus = true
            inputElement.addEventListener('keydown', event => event.key === 'Enter' && this.confirmButton.click())
            this.dialogContainer.querySelector('.dialog').insertBefore(inputElement, this.dialogContainer.querySelector('.dialog-actions'))
            this.inputElement = inputElement
        }
        this.inputElement.value = defaultValue

        let inputValue = defaultValue
        this.inputElement.oninput = () => inputValue = this.inputElement.value

        this.confirmButton.onclick = () => {
            if (onConfirm) onConfirm(inputValue)
            this.hide()
        }
        this.cancelButton.onclick = () => {
            if (onCancel) onCancel()
            this.hide()
        }

        this.dialogContainer.classList.add('show')
        this.inputElement.focus()
    }

    /**
     * @description Hide the dialog
     * 
     * @example
     * hide()
     */
    hide() {
        this.dialogContainer.classList.remove('show')
        if (this.inputElement)
            this.inputElement.remove()
        this.inputElement = null
    }
}

/**
 * @description The dialog instance
 * @type {Dialog} dialog - The dialog instance
 * @default new Dialog()
 * 
 * @example
 * dialog.show({ title: 'Notice', message: 'This is a dialog message' })
 */
export const dialog = new Dialog()