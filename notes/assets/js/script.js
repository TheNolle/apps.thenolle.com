import { initSidebar } from './sidebar.js'
import { initEditor } from './editor.js'
import { initContextMenu } from './contextMenu.js'

initSidebar()
initEditor()
initContextMenu()

document.querySelector('main').style.display = 'flex'

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/notes/serviceWorker.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope:', registration.scope)
                registration.update().then(() => console.log('ServiceWorker updated'))
            }, (error) => {
                console.log('ServiceWorker registration failed:', error)
            })
    })
}