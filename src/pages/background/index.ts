import { defaultSettings } from '../../scripts/platform/default_settings'
// FUNC: On Installed


chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set(defaultSettings)
	chrome.storage.local.get().then((data: UserBrowserStorage) => {
		if (data.outputProviders.length > 0) return
		for (const providers of data.outputProviders) {
			if (providers.accounts.length > 0) return
			for (const account of providers.accounts) {
				if (account.user && account.token) return
			}
		}
		chrome.windows.getCurrent().then((win) => {
			chrome.tabs.create({
				url: chrome.runtime.getURL('src/pages/options/index.html'),
			})
		})
	})
})

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
// 	if (tab.url.startsWith('http') && !tab.url.startsWith('https://www.notion.so/install-integration') || tab.url.startsWith('http') && !tab.url.startsWith('https://api.notion.com/')) {
// 		chrome.storage.local.get().then((data: UserBrowserStorage) => {
// 			if (changeInfo.status === 'complete' && data.outputProviders.length > 0) {
// 				chrome.tabs.sendMessage(tabId, { type: 'pageLoaded' })
// 			}
// 		})
// 	}
// })

// on action click send message "togglePopup" to content script
chrome.action.onClicked.addListener((tabs) => {
	chrome.tabs.sendMessage(tabs.id, 'togglePopup')
})

export { }