/**
 * @name Alert
 * @description A class to show alert messages to the user
 * 
 * @example
 * const alert = new Alert()
 * alert.show({ message: 'This is a success alert', type: 'success' })
 */
class Alert {
    constructor() {
        this.alertContainer = this.initAlertContainer()
    }

    /**
     * @description Initialize the alert container
     * @returns {HTMLDivElement} the alert container
     */
    initAlertContainer() {
        let container = document.querySelector('.alert-container')
        if (!container) {
            container = document.createElement('div')
            container.classList.add('alert-container')
            document.body.appendChild(container)
        }
        return container
    }

    /**
     * @description Show an alert message
     * @param {Object} options - The options for the alert
     * @param {string} options.message - The alert message
     * @param {'succes' | 'error' | 'warning' | 'info'} [options.type='info'] - The type of alert ('success', 'error', 'warning', 'info')
     * @param {number} [options.duration=3000] - How long the alert should be displayed (in milliseconds)
     * 
     * @example
     * alert.show({ message: 'This is a success alert', type: 'success' })
     */
    show({ message, type = 'info', duration = 3000 }) {
        const alert = document.createElement('div')
        alert.classList.add('alert', `alert-${type}`)
        alert.textContent = message
        alert.addEventListener('click', () => {
            alert.classList.add('hide')
            alert.addEventListener('transitionend', () => alert.remove())
        })
        this.alertContainer.appendChild(alert)

        setTimeout(() => alert.classList.add('show'), 100)
        setTimeout(() => {
            alert.classList.add('hide')
            alert.addEventListener('transitionend', () => alert.remove())
        }, duration)
    }

    /**
     * @description Show a success alert message
     * @param {Object} options - The options for the alert
     * @param {string} options.message - The alert message
     * @param {number} [options.duration=3000] - How long the alert should be displayed (in milliseconds)
     * 
     * @example
     * alert.success({ message: 'This is a success alert' })
     */
    success({ message, duration = 3000 }) {
        this.show({ message, type: 'success', duration })
    }

    /**
     * @description Show an error alert message
     * @param {Object} options - The options for the alert
     * @param {string} options.message - The alert message
     * @param {number} [options.duration=3000] - How long the alert should be displayed (in milliseconds)
     * 
     * @example
     * alert.error({ message: 'This is an error alert' })
     */
    error({ message, duration = 3000 }) {
        this.show({ message, type: 'error', duration })
    }

    /**
     * @description Show a warning alert message
     * @param {Object} options - The options for the alert
     * @param {string} options.message - The alert message
     * @param {number} [options.duration=3000] - How long the alert should be displayed (in milliseconds)
     * 
     * @example
     * alert.warning({ message: 'This is a warning alert' })
     */
    warning({ message, duration = 3000 }) {
        this.show({ message, type: 'warning', duration })
    }

    /**
     * @description Show an info alert message
     * @param {Object} options - The options for the alert
     * @param {string} options.message - The alert message
     * @param {number} [options.duration=3000] - How long the alert should be displayed (in milliseconds)
     * 
     * @example
     * alert.info({ message: 'This is an info alert' })
     */
    info({ message, duration = 3000 }) {
        this.show({ message, type: 'info', duration })
    }
}

/**
 * @description The alert instance
 * @type {Alert} alert - The alert instance
 * @default new Alert()
 * 
 * @example
 */
export const alert = new Alert()