
type UserBrowserStorage = {
	flows: Flow[],
	settings: CaptionSettings,
	inputProviders: InputProvider[]
	outputProviders: OutputProvider[]
	tags: Tag[]
	appState: {
		appExpanded: boolean,
		appPopup: boolean,
		selectedFlow: Flow,
	}
}
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
	tags: Tag[]
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
	value: string,
	text: string,
	$created?: boolean
}

declare type CaptionSettings = CaptionSettingOption[]
declare type CaptionSettingOption = {
	name: string
	id: string
	icon?: Icons
	group: string
	description?: string;
	type: "select" | "boolean" | "text" | "number" | "header" | "radio"
	options?: any[] | "flows" | "accounts"
	value?: any
}


declare type FlowProperty = Flow<keyof Flow> // for later use

declare type CaptureData = {}
declare type CustomFlowFormat = {}


declare type OutputDestination = {
	name: string
	id: string
	provider: OutputProvider['name']
	icon?: Icons | string | (() => string)
	props?: Prop[]
	raw?: any
}

declare type Prop = {
	name: string
	id: string
	type: PropTypes
	options?: SelectOption[] | GroupedSelectOption[]
	readOnly: boolean
	visible: boolean
	showAllCompatible: boolean
	savedValue: any
	savedInput: InputItem
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
	"image"

declare type Icons = import('../icons').CaptionIcons
