declare type InputProvider = {
	name: string,
	id: string,
	icon: Icons,
	accounts?: ProviderAccount[],
	data?: InputProviderData
}

declare type InputProviderData = InputGroup[] | InputItem[]
declare type InputGroup = {
	label: string,
	items: InputItem[],
	type?: InputItemType[],
	icon?: Icons
}
declare type InputItem = {
	item: any,
	source: string[],
	type?: InputItemType[],
	icon?: Icons
}


declare type InputItemType =
	"title"
	| "description"
	| "text"
	| "rich_text"
	| "number"
	| "boolean"
	| "tag"
	| "date"
	| "time"
	| "datetime"
	| "url"
	| "domain"
	| "phone_number"
	| "email"
	| "author"
	| "recipe"
	| "image"
	| "thumbnail"
	| "icon"
	| "video"
	| "audio"
	| "file"
	| "pdf"
	| "epub"
	| "json"
	| "xml"
	| "html"
	| "markdown"
	| "code"
	| "table"
	| "array"
	| "object"
	| "map"
	| "list"
	| "profile"
	| "profile_url"
	| "person"

declare type InputProviderRules = {
	onLoad?: {
		func: (() => void) | (() => Promise<InputProviderData>) | (() => InputProviderData),
		matches?: string[]
		css?: CSSRule,
	}
	onCaptionOpen?: onCaptionOpen[]
	addContext?: any // not complete
	onContext?: any // not complete
}

declare interface onPageLoad {
	(
		matches?: string,
		css?: CSSRule,
		func: () => void | Promise<InputProviderData> | InputProviderData,
	):
		void | Promise<InputProviderData> | InputProviderData
}

declare interface onCaptionOpen {
	(
		matches?: string,
		css?: CSSRule,
		func: () => void | Promise<InputProviderData>,
	):
		void | Promise<InputProviderData> | InputProviderData
}
