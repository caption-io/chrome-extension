// on message togglePopup reate modal if not exist and show it


browser.runtime.onMessage.addListener((message, sender) => {
	if (message === 'togglePopup') {
		showModal()
	} else if (message.message === 'height') {
		setModalHeight(message.height, message.width)
	}
})

let popup
document.addEventListener('DOMContentLoaded', () => {

	let modal = document.createElement('iframe')
	modal.setAttribute('id', 'caption-popup')
	modal.src = chrome.runtime.getURL('src/pages/popup/index.html')


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
	transition: 400ms ease;
	border: 1px solid transparent;
	outline: none;
	overflow: hidden;
	pointerEvents = 'none'

	`
	)

	document.body.appendChild(modal)
	popup = modal
})

let popupWidth = 400

function setModalHeight(height, width) {
	popup.style.width = width + 'px'
	popup.style.height = height + 'px'
}
function showModal() {
	// modal = iframe as node
	let modal = document.getElementById('caption-popup')
	let body = document.getElementsByTagName('html')[0]

	console.log("iFrame content window: ", modal)
	// modal.style.height = modalSize + 'px'
	if (modal.style.opacity === '0') {
		modal.style.opacity = '1'
		modal.style.pointerEvents = 'all'
	} else {
		modal.style.opacity = '0'
		modal.style.pointerEvents = 'none'
	}
}
export { }