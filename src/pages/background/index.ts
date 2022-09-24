browser.runtime.onInstalled.addListener(() => {
	browser.storage.local.set({
		flows: [],
		settings: {
			defaultFlow: null,
			colorMode: 'light'
		}
	})
})

browser.action.onClicked.addListener((tab) => {
	browser.tabs.sendMessage(tab.id, {
		type: "popupModal",
	})
})

browser.contextMenus.create({
	id: "ncpopup",
	title: "Notion Capture",
	contexts: ["all"],
})

browser.contextMenus.create({
	id: "ncpopup-capture",
	title: "Capture Page to Default",
	contexts: ["all"],
	parentId: "ncpopup",
})
browser.contextMenus.create({
	id: "ncpopup-capture-selected",
	title: "Capture Selected Text to Default",
	contexts: ["all"],
	parentId: "ncpopup",
})

browser.contextMenus.create({
	id: "ncpopup-divider",
	type: "separator",
	contexts: ["selection"],
	parentId: "ncpopup",
})

browser.contextMenus.create({
	id: "ncpopup-highlight-default",
	title: "Catpure Highlight to Default",
	contexts: ["selection"],
	parentId: "ncpopup",
})

browser.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "ncpopup-highlight-default") {
		console.log(info)
		console.log(tab)
	}
})

browser.contextMenus.create({
	id: "ncpopup-highlight-custom",
	title: "Catpure Highlight to Custom",
	contexts: ["selection"],
	parentId: "ncpopup",
})
export { }
