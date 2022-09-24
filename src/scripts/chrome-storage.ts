// export async function getFlows() {
//     return await browser.storage.local.get("flows")
//         .then(result => {
//             return result.flows;
//         }).catch(error => {
//             console.log(error);
//         });
// }

export const getFlows = async (): Promise<FlowData[]> => {
	return await browser.storage.local.get("flows")
		.then((result: Promise<UserBrowserStorage>) => result['flows'])
}

export const getSettings = async (): Promise<UserSettings> => {
	return await browser.storage.local.get("settings")
		.then((result: Promise<UserBrowserStorage>) => result['settings'])
}


export async function newFlows(flow) {
	const flows = await getFlows()
	chrome.storage.local.set({
		flows: [...flows, flow]
	})
}

export async function updateFlow(flow) {
	const flows = await getFlows()
	chrome.storage.local.set({
		flows: flows.map(f => f.id === flow.id ? flow : f)
	})
}

// update flow.name
export async function updateFlowName(flow) {
	const flows = await getFlows()
	chrome.storage.local.set({
		flows: flows.map(f => f.id === flow.id ? { ...f, name: flow.name } : f)
	})
}	

export async function findFlowById(id) {
	const flows = await getFlows()
	return flows.find(f => f.id === id)
}

// export async function deleteFlow(id) {
// 	const flows = await getFlows();
// 	chrome.storage.local.set({
// 		flows: flows.filter(f => f.id !== id)
// 	})
// }

export const deleteFlow = async (id) => {
	const flows = await getFlows()
	chrome.storage.local.set({
		flows: flows.filter(f => f.id !== id)
	})
}