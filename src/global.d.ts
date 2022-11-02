




// SECT: Styles

// GRP: Global
declare type AppColors = 'grey' | 'blue' | 'red' | 'green' | 'invert'

// GRP: Components
declare type ButtonStyles = "primary" | "secondary" | "outline" | "simple" | "disabled"

declare type SvelecteRenderer = "simple" | "with_icon" | "multi" | "data" | "select" | "multi_select" | "status"

declare type CaptionColors = "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red" | "teal" | "cyan" | "inherit"










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

// TODO: type web data




declare type UserSettings = {
	defaultPopupFlow: FlowData[id],
	defaultHighlightFlow: FlowData[id]
	colorMode: 'light' | 'dark',
	notionToken: string
}