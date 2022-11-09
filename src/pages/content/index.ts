let userBrowser = navigator.userAgent.toLowerCase() // Get the user agent string
chrome.runtime.onMessage.addListener((message, sender) => {
	if (message === 'togglePopup') {
		showModal()
	} else if (message.message === 'height') {
		setModalHeight(message.height, "height")
	} else if (message.message === 'width') {
		setModalHeight(message.width, "width")
	} else if (message.message === 'colorMode') {
		colorMode(message.mode)
	}
})
let currentUrl = window.location.href
let popupAllowed = (!currentUrl.startsWith('https://www.notion.so/install-integration') || !currentUrl.startsWith('https://api.notion.com/'))

let popup

if (popupAllowed) {
	document.addEventListener('DOMContentLoaded', () => {

		let modal = document.createElement('iframe')
		modal.setAttribute('allowtransparency', 'true')
		modal.setAttribute('id', 'caption-popup')
		modal.src = chrome.runtime.getURL('src/pages/popup/index.html')
		modal.title = 'Caption'

		modal.setAttribute('style',
			`
				top:24px;
				right:24px;
				position: fixed; 
				z-index: 9999;
				opacity: 0;
				border-radius: 8px;
				box-shadow: 0 0 4px rgba(0, 0, 0, 0.1), 0 0 1rem 0.5rem rgba(0, 0, 0, 0.10), 0 0 32px 0 rgba(255, 255, 255, 0.1);
				offset-anchor: top right;
				transition: 200ms ease;
				border: 1px solid transparent;
				outline: none;
				overflow: hidden;
				pointer-events: none;
			`
		)

		document.body.appendChild(modal)
		popup = modal
	})
}

function colorMode(mode) {
	if (mode === 'dark') {
		popup.style.backgroundColor = 'transparent'
		popup.style.border = '1px solid #4a5568'
	} else {
		popup.style.backgroundColor = 'transparent'
		popup.style.border = '1px solid rgb(41 43 47)'
	}
}

function setModalHeight(size, dimension) {

	if (dimension === 'width') {
		popup.style.width = size + 'px'
	} else {
		popup.style.height = size + 'px'
	}
}
function showModal() {
	let modal = document.getElementById('caption-popup')
	let body = document.getElementsByTagName('html')[0]

	if (modal.style.opacity === '0') {
		modal.style.opacity = '1'
		modal.style.pointerEvents = 'all'
	} else {
		modal.style.opacity = '0'
		modal.style.pointerEvents = 'none'
	}
}
export { }