import { newAccount } from "../platform/stores"
export async function createAuthTab(url) {
	return chrome.tabs
		.create({
			url: `https://api.notion.com/v1/oauth/authorize?client_id=ab6c8812-73c4-40cd-a993-210872654c27&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}&response_type=code`,
		}).then((tab) => {
			let authTab = tab
			return tab
		})
}

export function closeAuthTab(tab) {
		chrome.tabs.remove(tab.id)
}

export function newAcc(account: ProviderAccount) {
	newAccount.set(account)
}