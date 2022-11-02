// IMPORTS: Imports 

// IMPT: Stores
import { selectedFlow, flowStore, outputProvidersStore, accountStore, settingStore } from "src/scripts/platform/stores"
import { get } from "svelte/store"
// IMPT: Local
import { defaultFlow } from "./default-settings"
import { nanoid } from "nanoid"
import { outputManifest } from "src/providers-manifest"

//! IMPORTS 

// FUNCTIONS: Flow Functions
function FlowFunctions() {

	const flow = {

		// FUNC: Load
		async load(): Promise<Flow[]> {
			let allFLows: Promise<Flow[]> = await chrome.storage.local.get("flows")
				.then((result: Promise<UserBrowserStorage>) => {
					flowStore.set(result['flows'])
					return result['flows']
				})
			return allFLows
		},

		// FUNC: Create
		async create() {
			const storedFlows = await _flows.load()
			let newFlow = defaultFlow
			newFlow.id = nanoid() // generate a new ID for the flow
			const updatedFlows: Flow[] = [...storedFlows, newFlow]
			await chrome.storage.local.set({ flows: updatedFlows })
				.then(() => {
					_flows.load()
				})
		},

		// FUNC: Update
		async update(flowId: Flow['id'], setting, newValue) {
			let flows = await _flows.load()

			let updatedSettings = flows.map((f) => {
				if (f.id === flowId) {
					f[setting] = newValue
					return f
				} else {
					return f
				}
			})
			await chrome.storage.local.set({ flows: updatedSettings }).then(() => {
				_flows.load()
			})
		},

		async updateProp(flowId: Flow['id'], propId: Flow['defaultDestination']['props'][0]['id'], setting, newValue) {
			let flows = await _flows.load()

			let updatedSettings = flows.map((f) => {
				if (f.id === flowId) {
					f.defaultDestination.props.map((p) => {
						if (p.id === propId) {
							p[setting] = newValue
							return p
						} else {
							return p
						}
					})
					return f
				} else {
					return f
				}
			})
			await chrome.storage.local.set({ flows: updatedSettings }).then(() => {
				_flows.load()
			})

		},

		// FUNC: Delete
		async delete(id: Flow['id']) {
			const storedFlows = await flow.load()
			chrome.storage.local.set({
				flows: storedFlows.filter(f => f.id !== id)
			}).then((result) => {
				_flows.load()
			})
		}
	}
	return flow
}
//! FUNCTIONS

// FUNCTIONS: Output Provider Functions
function OutputProviderFunctions() {

	const outputProviders = {

		// FUNC: Load Output Providers
		async loadProviders(): Promise<OutputProvider[]> {
			return await chrome.storage.local.get("outputProviders")
				.then((result: Promise<UserBrowserStorage>) => {
					outputProvidersStore.set(result['outputProviders'])
					return result['outputProviders']
				})
		},

		// FUNC: Laod Accounts
		async loadAccounts(): Promise<ProviderAccount[]> {
			const oProv = await _outputProviders.loadProviders()
			let accts: ProviderAccount[] = []
			for (let provider of oProv) {
				for (let account of provider.accounts) {
					accts.push(account)
				}
			}
			accountStore.set(accts)
			return accts
		},

		// FUNC: Add Account
		addAccount() {
			chrome.tabs.create({
				url: chrome.runtime.getURL('src/pages/options/index.html'),
			})
		}

	}
	return outputProviders
}
//! FUNCTIONS 

// FUNCTIONS: Settings Functions
function SettingsFunctions() {

	const settings = {

		// FUNC: Load All Settings
		async loadAll(): Promise<CaptionSettings> {
			return await chrome.storage.local.get("settings")
				.then((result: Promise<UserBrowserStorage>) => {
					settingStore.set(result['settings'])
					return result['settings']
				})
		},

		// FUNC: Load One Settings
		async load(setting) {
			const settings = await _settings.loadAll()
			let value: CaptionSettingOption['value']
			for (let s of settings) {
				if (s.id === setting) {
					value = s.value
				}
			}
			return value
		},

		// FUNC: Save Setting
		async save(key: string, value: any) {

			_settings.loadAll().then((settings: CaptionSettings) => {
				let s = settings.map((set) => {
					if (set.id === key) {
						set.value = value
						return set
					} else {
						return set
					}
				})
				chrome.storage.local.set({ settings: s }).then((result) => {
					_settings.loadAll()
					return result
				})
			})
		}

	}
	return settings
}
//! FUNCTIONS

// VARIABLES: Function Exports
export const _flows = FlowFunctions()
export const _outputProviders = OutputProviderFunctions()
export const _settings = SettingsFunctions()

//! VARIABLES






// FUNCTIONS: Utility

export const goBack = () => selectedFlow.set(null)

//! FUNCTIONS