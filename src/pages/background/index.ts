// VARS: Local
const defaultSettings: UserBrowserStorage = {
	flows: [],
	settings: {
		defaultPopupFlow: null,
		defaultHighlightFlow: null,
		colorMode: 'light',
		notionToken: "secret_P1YEBheytEkSTQnT126JOpZdo8WbsF2SxfsjnzcXFGr",
	},
	pageData: null,
}

// FUNCS: On Installed
browser.runtime.onInstalled.addListener(() => {
	browser.storage.local.set(defaultSettings)
})

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		browser.tabs.sendMessage(tabId, { type: 'pageLoaded' })
	}
});
	
// })




// browser.contextMenus.create({
// 	id: "ncPopup",
// 	title: "Notion Capture",
// 	contexts: ["all"],
// })

// browser.contextMenus.create({
// 	id: "ncPopupCapture",
// 	title: "Capture Page to Default",
// 	contexts: ["all"],
// 	parentId: "ncpopup",
// })

// browser.contextMenus.create({
// 	id: "ncPopupCaptureSelected",
// 	title: "Capture Selected Text to Default",
// 	contexts: ["all"],
// 	parentId: "ncpopup",
// })

// browser.contextMenus.create({
// 	id: "ncPopupDivider",
// 	type: "separator",
// 	contexts: ["selection"],
// 	parentId: "ncpopup",
// })

// browser.contextMenus.create({
// 	id: "ncPopupHighlightDefault",
// 	title: "Catpure Highlight to Default",
// 	contexts: ["selection"],
// 	parentId: "ncpopup",
// })

// browser.contextMenus.create({
// 	id: "ncPopupHighlightCustom",
// 	title: "Catpure Highlight to Custom",
// 	contexts: ["selection"],
// 	parentId: "ncpopup",
// })

export { }