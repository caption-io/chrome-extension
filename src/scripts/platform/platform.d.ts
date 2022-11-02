
declare type UserBrowserStorage = {
	flows: Flow[],
	settings: CaptionSettings,
	inputProviders: InputProvider[]
	outputProviders: OutputProvider[]
	tags: Tag[]
}

declare type Tag = {
	value: string,
	text: string,
	$created?: boolean
}

declare type ProviderAccount = {
	name: string,
	id?: string,
	icon?: Icons
	token?: string,
	botId?: string,
	user?: any,
}
declare type OutputProvider = {
	name: string,
	id: string
	icon: Icons,
	color: CSSStyleRule['style']['backgroundColor']
	accounts: ProviderAccount[]
}
// declare type for a module that contains a function auth() that returns Promise<ProviderAccount>

declare type OutputProviderAuthFlow = {
	auth: () => Promise<ProviderAccount>,
}
declare type InputProvider = {
	name: string,
	id: string,
	icon: Icons,
	accounts: ProviderAccount[]
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
	options?: NotionSelectOption[] | NotionStatusOption[]
	readOnly: boolean
	visible: boolean
	showAllCompatible: boolean
	savedValue: any
	savedInput: InputItem
}

declare type PropTypes = "title" |
	"select" |
	"multi_select" |
	"checkbox" |
	"date" |
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
	"coverImage"

declare type Icons = import('../../icons').CaptionIcons
