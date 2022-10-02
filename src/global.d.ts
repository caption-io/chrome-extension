
declare type DndEvent = import("svelte-dnd-action").DndEvent
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void
		onfinalize?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void
	}
}



// SECT: Styles

// GRP: Global
declare type AppColors = 'grey' | 'blue' | 'red' | 'green' | 'invert'
declare type Icons = import('./icons').AppIcons

// GRP: Components
declare type ButtonStyles = "primary" | "secondary" | "outline" | "simple" | "disabled"

declare type SvelecteRenderer = "simple" | "with_icon" | "multi" | "data" | "select" | "multi_select" | "status"

declare type NotionColors = "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red"

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
	groupHeader: "string"
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

declare type NotionDatabase = {
	name: string
	id: string
	icon?: Icons | string | (() => string),
	props?: NotionProp[],
	raw?: any
}

declare type ContextMenuOptions = {
	label: string,
	message: string,
	icon?: Icons,
	style?: 'default' | 'danger' | 'disabled'
} | 'divider'
// !SECT

// TODO: Type this better
declare type DefaultDatabase = SvelecteOption | (() => SvelectOption) & {
	text: string,
	value: {
		props: SvelecteOption[]
	}
}

declare type FlowTags = {
	app: AppTags[]
	user: string[] | null
}
declare type AppTags = 'highlightDefault' | 'captureDefault' | 'favorite' | 'uncategorized' | null

declare type UserBrowserStorage = {
	flows: FlowData[],
	settings: UserSettings,
}

declare type FlowData = {
	name: string
	id: string
	defaultDatabase: NotionDatabase
	tags: string[] | null
	favorite: boolean
	captureCount: number
}

declare type UserSettings = {
	defaultPopupFlow: FlowData[id],
	defaultHighlightFlow: FlowData[id]
	colorMode: 'light' | 'dark',
	notionToken: string
}