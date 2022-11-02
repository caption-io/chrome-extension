declare type InputProvider = {
	name: string,
	id: string,
	icon: Icons,
	accounts?: ProviderAccount[],
	data?: InputProviderData;
}

declare type InputProviderData = InputGroup[]
declare type InputGroup = {
	groupHeader: string,
	items:InputItem[],
	type: string;
	priority: number;
	icon?: Icons;
}
declare type InputItem = {
	text: string,
	source: string[],
	type?: InputItemType[],
	size?: number,
	$isGroupItem?: boolean
	$isGroupHeader?: boolean
	icon?: Icons
	label?: string
}

declare type InputItemType = "text" | "number" | "boolean" | "date" | "time" | "datetime" | "url" | "domain"| "phone_number" | "email" | "author" | "recipe" | "rich_text" | "image" | "thumbnail" | "icon" | "video" | "audio" | "file" | "pdf" | "epub" | "zip" | "json" | "xml" | "html" | "markdown" | "code" | "table" | "array" | "object" | "map" | "list"