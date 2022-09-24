declare type DndEvent = import("svelte-dnd-action").DndEvent
declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onconsider?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void
		onfinalize?: (event: CustomEvent<DndEvent> & { target: EventTarget & T }) => void
	}
}

declare type SelectComponentType = "dbPicker" | "webPicker" | "select" | "multi_select" | "relation" | "people"

// SECT: Styles

// GRP: Global
declare type AppColors = 'grey' | 'blue' | 'red' | 'green' | 'invert'
declare type Icons = import('./icons').AppIcons

// GRP: Components
declare type ButtonStyles = "primary" | "secondary" | "outline" | "simple" | "disabled"

declare type ContextMenuOptions = {
	label: string,
	message: string,
	icon?: Icons,
	style?: 'default' | 'danger' | 'disabled'
} | 'divider'
// !SECT

// TODO: Type this better
declare type DefaultDatabase = any | null

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
	tags: FlowTags
} | null

declare type UserSettings = {
	defaultFlow: FlowData[id] | null,
	colorMode: 'light' | 'dark'
}
