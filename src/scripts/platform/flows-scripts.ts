// IMPT: Imports
// svelte stores
import { selectedFlow, flows } from "src/scripts/platform/stores";

// packages
import { nanoid } from "nanoid";


// VARS: Variables


// GRP: Load all Flows
// load flows from chrome storage and set to flows store
async function loadFlowsFromStorage(): Promise<FlowData[]> {
	return await browser.storage.local.get("flows")
		.then((result: Promise<UserBrowserStorage>) => {
			console.log("Flow Scripts | Flows loaded from storage: ", result)
			return result['flows'];
		})
}

export async function loadFlows(){
	const storedFlows = await loadFlowsFromStorage()
	flows.set(storedFlows)
}

// GRP: Save all Flows
async function saveFlowsToStorage(updatedFlows: FlowData[]){
	return await browser.storage.local.set({ flows: updatedFlows })
		.then(result => {
			console.log("Flow Scripts | Flows saved to storage: ", result)
		})
}

// GRP: Create new Flow
export async function newFlow() {
	const newFlow: FlowData = {
		name: "Untitled",
		id: nanoid(16),
		defaultDatabase: null,
		tags: null,
		favorite: false,
		captureCount: 0,
	};
	const storedFlows = await loadFlowsFromStorage()
	const updatedFlows = [...storedFlows, newFlow]
	saveFlowsToStorage(updatedFlows)
}

export async function updateFlowName(flow) {
	const storedFlows = await loadFlowsFromStorage()
	chrome.storage.local.set({
		flows: storedFlows.map(f => f.id === flow.id ? { ...f, name: flow.name } : f)
	}).then((result) => {
		console.log("Flow Scripts | Flow name updated: ", result)
	})
}	

export const deleteFlow = async (id) => {
	const storedFlows = await loadFlowsFromStorage()
	chrome.storage.local.set({
		flows: storedFlows.filter(f => f.id !== id)
	}).then((result) => {
		console.log("Flow Scripts | Flow deleted: ", result)
	})
}

export const goBack = () => selectedFlow.set(null);
