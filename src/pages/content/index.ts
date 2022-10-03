
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === 'pageLoaded') {


		const pageDataGet = parsePageData()
		chrome.storage.local.set({ pageData: pageDataGet })


		function parsePageData() {

			function getIcon() {
				// return biggest favicon
				const icons = document.querySelectorAll('link[rel="icon"]').length > 0 ? document.querySelectorAll('link[rel="icon"]') : document.querySelectorAll('link[rel="shortcut icon"]')
				let biggestIcon = null
				let biggestIconSize = 0

				icons.forEach((icon) => {
					const iconSize = icon.sizes.length > 0 ? parseInt(icon.sizes) : 0
					if (iconSize > biggestIconSize) {
						biggestIcon = icon.href
						biggestIconSize = iconSize
					}
				})
				return biggestIcon
			}

			const pageData = {
				// get opengraph data
				title: document.querySelector('meta[property="og:title"]') ? document.querySelector('meta[property="og:title"]')?.getAttribute('content') : document.title,
				url: document.querySelector('meta[property="og:url"]') ? document.querySelector('meta[property="og:url"]')?.getAttribute('content') : window.location.href,
				// get highest res favicon
				icon: getIcon(),
				selection: window.getSelection(),
			}
			console.log(pageData)
			return pageData
		}
	}
})

	// when text is selected, console log it
	// document.addEventListener('selectionchange', () => {
	// 	// get selected text as html
	// 	const selection = window.getSelection()

	// 	function getHTMLOfSelection () {
	// 		var range;
	// 		if (document.selection && document.selection.createRange) {
	// 		  range = document.selection.createRange();
	// 		  return range.htmlText;
	// 		}
	// 		else if (window.getSelection) {
	// 		  var selection = window.getSelection();
	// 		  if (selection.rangeCount > 0) {
	// 			range = selection.getRangeAt(0);
	// 			var clonedSelection = range.cloneContents();
	// 			var div = document.createElement('div');
	// 			div.appendChild(clonedSelection);
	// 			return div.innerHTML;
	// 		  }
	// 		  else {
	// 			return '';
	// 		  }
	// 		}
	// 		else {
	// 		  return '';
	// 		}
	// 	  }
	// })

// // on message togglePopup showModal()
// import {browser} from 'webextension-polyfill-ts'

// browser.runtime.onMessage.addListener((message) => {
// 	if (message.command === 'togglePopup') {
// 		showModal()
// 	}
// })


// function createModal() {
// 	let modal = document.createElement('iframe')
// 	modal.setAttribute('id', 'caption-popup')
// 	modal.setAttribute('allowtransparency', 'true')

// 	modal.setAttribute('style',
// 		`
// 				top:32px;
// 				right:32px;
// 				border-radius: 8px;
// 				position: fixed; 
// 				z-index: 9999;
// 				height: calc(100vh - 64px);
// 				width: 400px;
// 				box-shadow: 0 0 16px rgba(0,0,0,0.2), 0 0 0 1rem rgba(0,0,0,0.2);
// 				transition: 300ms ease;
// 				opacity: 0;
// 				border: 0;
// 			`
// 	)

// 	document.body.appendChild(modal)
// 	modal.src = chrome.runtime.getURL('src/pages/popup/index.html')
// }

// function showModal() {
// 	let modal = document.getElementById('caption-popup')
// 	if (modal.style.opacity === '0') {
// 		modal.style.opacity = '1'
// 	} else {
// 		modal.style.opacity = '0'
// 	}
// }
