async function getCurrentTab() {
	let queryOptions = { active: true, lastFocusedWindow: true };
	let [tab] = await browser.tabs.query(queryOptions);
	console.log(tab);
}
