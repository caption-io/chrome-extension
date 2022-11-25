
export const defaultSettings: UserBrowserStorage = {
	flows: [],
	settings: [
		{
			name: "On Open",
			id: "onOpen",
			group: "Flows",
			type: "select",
			description: "What Caption opens to by default when the toolbar button is clicked",
			options: [
				{
					name: "Last Flow",
					id: "lastFlow"
				},
				{
					name: "Flow List",
					id: "flowList"
				},
				{
					name: "Default Flow",
					id: "defaultFlow"
				},
				{
					name: "Default Highlight Flow",
					id: "defaultHighlightFlow"
				}
			],
			value: "flowList"
		},
		{
			name: "Default Flow",
			id: "defaultFlow",
			group: "Flows",
			type: "select",
			description: "The Flow Caption opens if the 'On Open' setting is set to default flow, or when the keyboard shortcut is used.",
			options: "flows",
			value: null,
		},
		{
			name: "Default Highlight Flow",
			id: "defaultHlFlow",
			group: "Flows",
			type: "select",
			description: "The Flow to be used by default when capturing highlights",
			options: "flows",
			value: null,
		},
		{
			name: "Auto Fill Web Data",
			id: "autoFillWebData",
			group: "Flows",
			type: "boolean",
			description: "Whether or not a Flow should be automatically filled with web data when it is opened",
			value: true,
		},
		{
			name: "Default Workspace",
			id: "defaultAccount",
			group: "Accounts",
			type: "select",
			description: "The account to selected by default when creating a new Flow",
			options: "accounts",
			value: null,
		},
		{
			name: "Combine Workspaces",
			id: "combineAccounts",
			group: "Accounts",
			type: "boolean",
			description: "Combine database selection from all workspaces into a single list.",
			value: false,
		},
		{
			name: "Extension Storage",
			id: "extensionStorage",
			group: "Extension",
			type: "select",
			description: "Where to store your data. Syncing will store your flows and settings using the account your're logged into your browser with. Local will store your data on your computer only.",
			options: [
				{
					name: "Local",
					id: "local",
				},
				{
					name: "Sync",
					id: "sync",
				},
			],
			value: "local",
		},
		{
			name: "Default Popup Type",
			id: "defaultPopupType",
			group: "Extension",
			type: "select",
			description: "The type of popup to open when the toolbar button is clicked. Dynamic Modal is strongly recommended. Native Extension is only reccomended if you are having performance issues with Dynamic Modal.",
			options: [
				{
					name: "Dynamic Modal",
					id: "modal",
				},
				{
					name: "Popup Window",
					id: "popup",
				},
				{
					name: "Native Extension",
					id: "sidebar",
				},
			],
			value: "modal",
		},
		{
			name: "Open Expanded",
			id: "openExpanded",
			group: "Extension",
			type: "boolean",
			description: "Open the popup window expanded by default. Only applies if 'Popup Type' is set to 'Dynamic Modal'.",
			value: false,
		},
		{
			name: "Color Mode",
			id: "colorMode",
			group: "Extension",
			type: "radio",

			options: [
				{
					name: "Light",
					id: "light",
					icon: "sun"
				},
				{
					name: "Dark",
					id: "dark",
					icon: "moon"
				},
				{
					name: "System",
					id: "system",
					icon: "monitor"
				},
			],
			value: "light",
		},
	],
	inputProviders: [],
	outputProviders: [],
	tags: [],
	appState: {
		window: {
			appExpanded: false,
			appPopup: false,
		},
		nav: {
			selectedFlow: null,
		},
		flowList: {
			listView: "byAll",
			sortMode: {
				byAll: "lastUsed",
				byTag: "name",
				byFolder: "name",
			}
		}
	}
}
async function idSetter() {
	let nanoid = await import("nanoid")
	let id = nanoid.nanoid(16)
	return Promise.resolve(id)
}

export let defaultFlow: Flow = {
	name: "Untitled",
	id: null,
	captureCount: 0,
	captureHistory: [],
	archived: false,
	defaultAccount: null,
	defaultDestination: null,
	specialFormat: null,
	favorite: false,
	keyboardShortcut: null,
	shortcutBehavior: "open",
	tags: [],
	behavior: "create",
	type: "inputCapture",
	autoCapture: false,
	autofillTitle: true,
	autofillUrl: true,
	autofillDescription: true,
	autofillCover: true,
	autofillIcon: true,
}

export const propData = {
	defaultSort: [
		"title",
		"url",
		"pageIcon",
		"coverImage",
		"select",
		"multi_select",
		"checkbox",
		"date",
		"rich_text",
		"status",
		"number",
		"people",
		"files",
		"email",
		"phone_number",
		"relation",
		"formula",
		"created_time",
		"last_edited_time",
		"created_by",
		"last_edited_by",
		"rollup",
	],
	selectProps: ["select", "multi_select", "status", "relation"],
	textInputProps: [
		"title",
		"rich_text",
		"number",
		"email",
		"phone_number",
		"url",
		"files",
	],
	readOnlyProps: [
		"formula",
		"created_time",
		"last_edited_time",
		"created_by",
		"last_edited_by",
		"rollup",
		"people",
		"pageIcon",
		"coverImage",
	]
}