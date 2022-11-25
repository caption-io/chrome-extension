import { writable, type Writable } from "svelte/store"

// FUNC: STORE FUNCTIONS
function basicArrayStoreFunc() {
	const { subscribe, set, update } = writable([])

	return {
		subscribe,
		set: flows => {
			set(flows)
		},
		new: (flow) => update(flows => [...flows, flow]),
		remove: (flow) => update(flows => flows.filter(f => f !== flow)),
		update: (flow) => update(flows => flows.map(f => f.id === flow.id ? flow : f))
	}
}

// VARS: HIGH LEVEL STORES
export const flowStore: Writable<Flow[]> = basicArrayStoreFunc()
export const tagStore: Writable<Tag[]> = basicArrayStoreFunc()
export const outputProvidersStore: Writable<OutputProvider[]> = basicArrayStoreFunc()
export const settingStore: Writable<CaptionSettings> = writable()
export const accountStore: Writable<ProviderAccount[]> = writable([])


// VARS: Receives from Input Providers
export const webData: Writable<InputProviderData> = writable(null)

// VARS: Receives from Output Providers
export const newAccount: Writable<ProviderAccount> = writable(null)
export const noAccounts: Writable<boolean> = writable(true)

// VARS: UI Variables
export const maxSize: Writable<{ width: number, height: number }> = writable({ width: 0, height: 0 })
export const tooltipInfo: Writable<{
	text: string, position: | "top-left"
	| "top-center"
	| "top-right"
	| "right"
	| "bottom-right"
	| "bottom-center"
	| "bottom-left"
	| "left",
	location: { x: number, y: number },
	locationOffset?: { x: number, y: number }
	delay?: number
}> = writable(null)

export const modalInfo: Writable<{
	title: string,
	subtitle: string,
	options: [
		{
			label: string,
			icon?: Icons,
			buttonType: any
		}
	]
}> = writable(null)
export const activeAccount: Writable<ProviderAccount['id']> = writable(null)


export const tags = writable([])

export const onLoadInputData: Writable<InputProvider[]> = writable([])

// UI STATE
export const minimized: Writable<boolean> = writable(false)
export const appExpanded: Writable<boolean> = writable(false)
export const dropdownExtraHeight: Writable<number> = writable(0)
export const activePage: Writable<string> = writable("flowList")
export const selectedFlow: Writable<Flow> = writable(null)

// SETTINGS STORES
export const popupType: Writable<"dynamic" | "popup" | "window"> = writable("dynamic")
export const appTheme: Writable<"dark" | "light"> = writable("light")