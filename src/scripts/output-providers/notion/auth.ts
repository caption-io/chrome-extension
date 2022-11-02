import { createAuthTab, closeAuthTab, newAcc } from "../providers"
export function auth() {
	createAuthTab(`https://api.notion.com/v1/oauth/authorize?client_id=ab6c8812-73c4-40cd-a993-210872654c27&&response_type=code`).then((authTab) => {
		chrome.tabs.onUpdated.addListener((
			tabId,
			changeInfo,
			tab
		) => {
			if (tabId === authTab.id && changeInfo.url) {
				if (changeInfo.url.includes(chrome.identity.getRedirectURL())) {
					closeAuthTab(authTab)
					fetch("https://api.notion.com/v1/oauth/token", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							// environment variable
							"Authorization": import.meta.env.VITE_NOTION_SECRET,
						},
						body: JSON.stringify({
							"grant_type": "authorization_code",
							"code": changeInfo.url.match(/code=(.*?)&/)[1],
							"redirect_uri": chrome.identity.getRedirectURL(),
						}),
					})
						.then((response) => response.json())
						.then((data) => {
							newAcc({
								name: data.workspace_name,
								id: data.workspace_id,
								icon: data.workspace_icon,
								token: data.access_token,
								botId: data.bot_id,
								user: data.owner,
							})
						})
				}
			}
		})

	})
}

export type auth = typeof auth