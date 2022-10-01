
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
declare type SvelecteOption = {
	text: string,
	value: string,
	icon?: Icons | string | (() => string),
	extras?: {
		props?: SvelecteOption[],
		type?: PropertyItemPropertyItemListResponse[property_item.type],
		options?: (() => SvelecteOption) | SvelecteOption,
		color?: string,
		group?: string,
		raw?: any
	}
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
	extras: {
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
	defaultDatabase: DefaultDatabase
	tags: string[] | null
	favorite: boolean
} | null

declare type UserSettings = {
	defaultFlow: FlowData[id] | null,
	colorMode: 'light' | 'dark',
	notionToken: string | null
}

// GRP: Notion Stuff
declare type NotionColors = "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red"
declare type NotionMultiSelectOption = {
	id: string,
	name: string,
	color: NotionColors
}