import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";


export function clickAnimation(e: Event, color: string) {
	const target = e.target as HTMLElement
	target.style.animation = `click 0.35s ease-out`
	// timeout remove
	setTimeout(() => {
		target.style.animation = ''
	}, 200)
}


export let dragDisabled = true
const flipDurationMs = 200
export let items;

export function dndItems() {

	return {
		setItems: (item) => {
			items = item
		},
		getItems: () => {
			return items
		}
	}
}

export function DndSetItems(i) {
	items = i
	console.log("Dnd Items", items)
}

export function DndGetItems(d) {
	return items
}
 export function handleDndConsider(e) {
	const {
		items: newItems,
		info: { source, trigger },
	} = e.detail
	items = newItems
	if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
		dragDisabled = true
	}
	console.log('handleDndConsider', e.detail)
}

export function handleDndFinalize(e) {
	const {
		items: newItems,
		info: { source },
	} = e.detail
	items = newItems
	if (source === SOURCES.POINTER) {
		dragDisabled = true
	}
	browser.storage.local.set({ flows: items })
}

export function startDrag(e) {
	e.preventDefault()
	dragDisabled = false
	console.log("dragging: ",dragDisabled)
}

export function handleKeyDown(e) {
	if ((e.key === "Enter" || e.key === " ") && dragDisabled)
		dragDisabled = false
}

// custom svelte transition scale from top
export function scaleFromTop(node, { delay = 0, duration = 200 }) {
	const o = +getComputedStyle(node).opacity
	const h = parseFloat(getComputedStyle(node).height)
	return {
		delay,
		duration,
		css: (t) =>
			`opacity: ${t * o}; transform: scale(${t}, ${t}) translateY(${
				1 - t
			} * ${h}px);`,
	}
}