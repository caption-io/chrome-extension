chrome.runtime.onMessage.addListener(request => {
	if (request.type === 'popupModal') {
		showModal();
	}
});

function showModal() {
	const modal = document.createElement('div');
	modal.setAttribute(
		'style',
		`
box-sizing:border-box;
overflow:hidden;
border: 1px solid #ffffff;
top:16px;
right:16px;
border:none;
margin:0;
padding:0;
border-radius:12px;
background-color:white;
position: fixed; box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.55);
z-index: 99999;
`
	);
    modal.setAttribute('id', 'ncpopup');
	modal.innerHTML = `<iframe id="popup-content"; onload='javascript:(function(o){o.style.height=o.contentWindow.document.body.scrollHeight+"px";}(this));' style="height:400px; width:400px; display: block;"></iframe>
<div style="position:absolute; top:2px; right:0px; margin:0px; padding:0px;">
<button style="padding: 8px 8px; font-size: 16px; border: none; border-radius: 20px; background: none;">x</button>
</div>`;
	document.body.appendChild(modal);
	const dialog = document.querySelector('#ncpopup');
	const iframe = document.getElementById('popup-content');
	iframe.src = chrome.runtime.getURL('src/pages/popup/index.html');
	iframe.frameBorder = 0;
}
// browser.action.onClicked.addListener(tab => {
// 	browser.scripting.executeScript({
// 		target: {
// 			tabId: tab.id,
// 		},
// 		func: insertDeps,
// 	});

// });

export {};
