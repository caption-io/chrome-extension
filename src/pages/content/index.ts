// chrome.runtime.onMessage.addListener(request => {
// 	if (request.type === 'popupModal') {
// 		showModal();
// 	}
// });

// function resizeIFrameToFitContent( iFrame ) {

//     iFrame.width  = iFrame.contentWindow.document.body.scrollWidth;
//     iFrame.height = iFrame.contentWindow.document.body.scrollHeight;
// }

// function showModal() {
// 	const modal = document.createElement('iframe');
// 	modal.setAttribute(
// 		'style',
// 		`
// 		top:0px;
// 		right:0px;
		
// 		position: fixed; 
// 		z-index: 9999;
// `
// 	);
// 	modal.setAttribute('id', 'caption-popup');
// 	modal.setAttribute('allowtransparency', 'true');
// 	document.body.appendChild(modal);
// 	modal.src = chrome.runtime.getURL('src/pages/popup/index.html');
// 	modal.frameBorder = "0";
// }
// // browser.action.onClicked.addListener(tab => {
// // 	browser.scripting.executeScript({
// // 		target: {
// // 			tabId: tab.id,
// // 		},
// // 		func: insertDeps,
// // 	});

// // });

// export {};

export default function test() { 
	console.log(window.getSelection());
}