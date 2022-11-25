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
let popupAllowed = (!currentUrl.startsWith('https://www.notion.so/install-integration') || !currentUrl.startsWith('https://api.notion.com/') || !currentUrl.startsWith('chrome://') || !currentUrl.startsWith('edge://'))

let popup

let modalVisible = false

if (popupAllowed) {
	document.addEventListener('DOMContentLoaded', () => {

		let modal = document.createElement('iframe')
		modal.setAttribute('allowtransparency', 'true')
		modal.setAttribute('id', 'caption-popup')
		modal.title = 'Caption'
		modal.style.width = '0px'
		modal.style.height = '0px'


		modal.setAttribute('style',
			`
				top:16px;
				right:16px;
				position: fixed; 
				z-index: 9999;
				opacity: 0;
				border-radius: 12px;
				box-shadow: 0 0 4px rgba(0, 0, 0, 0.1), 0 0 1rem 0.5rem rgba(0, 0, 0, 0.10), 0 0 32px 0 rgba(255, 255, 255, 0.1);
				offset-anchor: top right;
				transition: 0ms ease;
				border: 1px solid transparent;
				outline: none;
				overflow: hidden;
				pointer-events: none;
				backdrop-filter: blur(8px);
			`
		)

		document.body.appendChild(modal)
		popup = modal
	})
}

function colorMode(mode) {
	if (mode === 'dark') {
		popup.style.backgroundColor = 'transparent'
		popup.style.border = '6px solid rgba(10 14 18 / 80%)'
	} else {
		popup.style.backgroundColor = 'trasnparent'
		popup.style.border = '6px solid rgba(201 203 207 / 80%)'
	}
}


function setModalHeight(size, dimension) {

	if (dimension === 'width') {
		popup.style.width = size + 12 + 'px'
	} else {
		popup.style.height = size + 12 + 'px'
	}
}
function showModal() {
	let modal = document.getElementById('caption-popup') as HTMLIFrameElement
	let body = document.getElementsByTagName('html')[0]

	if (modal.style.opacity === '0') {
		modal.src = chrome.runtime.getURL('src/pages/popup/index.html')
		modal.style.pointerEvents = 'all'
		setTimeout(() => {
			modal.style.transition = '200ms ease'
			modal.style.opacity = '1'
		}, 100)



	} else {
		modal.style.opacity = '0'
		modal.style.pointerEvents = 'none'
		// wait 100ms for the animation to finish
		setTimeout(() => {
			modal.src = ""
			modal.style.transition = '0ms ease'
		}, 200)

	}
}
export {}