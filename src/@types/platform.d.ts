
// TYPES: Platform Storage
type UserBrowserStorage = {
	flows: Flow[],
	settings: CaptionSettings,
	inputProviders: InputProvider[]
	outputProviders: OutputProvider[]
	tags: Tag[]
	appState: {
		window: {
			appExpanded: boolean,
			appPopup: boolean
		},
		nav: {
			selectedFlow: Flow
		}
		flowList: {
			listView: "byTag" | "byFolder" | "byAll",
			sortMode: {
				byTag: "name" | "destinationName" | "lastUsed" | "captureCount",
				byFolder: "name" | "destinationName" | "lastUsed" | "captureCount",
				byAll: "Name" | "destinationName" | "lastUsed" | "captureCount"
			}
		}
	}
}

// TYPES: Flow Data
declare type Flow = {
	name: string
	id: string
	captureCount: number
	captureHistory: CaptureData[] // currently unused, privacy?
	archived: boolean
	defaultAccount: ProviderAccount['id']
	defaultDestination: OutputDestination
	specialFormat: "youtube" | "twitter" | CustomFlowFormat // for later use
	favorite: boolean
	keyboardShortcut: string
	shortcutBehavior: "open" | "instantCapture"
	tags: Tag['id'][]
	behavior: "create" | "append" | "update" // default create, others unused currently
	type: "inputCapture" | "quickAdd"
	autoCapture: boolean
	autofillTitle: boolean
	autofillUrl: boolean
	autofillDescription: boolean
	autofillCover: boolean
	autofillIcon: boolean
}

declare type Tag = {
	name: string,
	id: string,
}

// TYPES: Settings Data
declare type CaptionSettings = CaptionSettingOption[]
declare type CaptionSettingOption = {
	name: string
	id: string
	icon?: Icons
	group: string
	description?: string
	type: "select" | "boolean" | "text" | "number" | "header" | "radio"
	options?: any[] | "flows" | "accounts" | RadioOptions[]
	value?: any
}

declare type RadioOptions = {
	name: string
	id: string
	icon?: Icons
	image?: string
}

declare type FlowProperty = Flow<keyof Flow> // for later use

declare type CaptureData = {}
declare type CustomFlowFormat = {}




declare type FlowProp = {
	name: string
	id: string
	type: PropTypes
	options?: SelectOption[] | GroupedSelectOption[]
	readOnly: boolean
	visible: boolean
	showAllCompatible: boolean
	savedValue: any
	requestFunction?: { func: string, args: any} | false
	savedInput: {
		inputItem: InputItem,
		inputItemGroup: InputGroup,
		inputItemProvider: InputProvider,
	}
	value?: any;
}

declare type PropTypes = "title" |
	"select" |
	"multi_select" |
	"group_select" |
	"checkbox" |
	"date" |
	"time" |
	"rich_text" |
	"number" |
	"people" |
	"files" |
	"url" |
	"email" |
	"phone_number" |
	"relation" |
	"status" |
	"formula" |
	"created_time" |
	"last_edited_time" |
	"created_by" |
	"last_edited_by" |
	"rollup" |
	"pageIcon" |
	"coverImage" |
	"image" |
	"pageContent"

declare type Icons = import('../icons').CaptionIcons
