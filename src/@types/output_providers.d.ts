declare type ProviderAccount = {
	name: string,
	id?: string,
	icon?: Icons
	token?: string,
	botId?: string,
	user?: any,
}

declare type OutputProvider = {
	name: string
	id: string
	icon: Icons
	color: CSSStyleRule['style']['backgroundColor']
	accounts: ProviderAccount[]
}

declare type NotionDatabase = {
	name: string
	id: string
	icon?: Icons | string | (() => string),
	props?: NotionProp[],
	raw?: any
}

declare type NotionProp = {
	name: string
	id: string
	type: NotionPropTypes
	storedValue: string
	options?: NotionSelectOption[] | NotionStatusOption[]
	visible: boolean
}

declare type NotionSelectOption = {
	name: string
	id: string
	color: NotionColors
}

declare type NotionStatusOption = {
	groupHeader: string
	options: NotionSelectOption[]
}

declare type NotionPropTypes = "title" |
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
