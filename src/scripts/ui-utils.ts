
export function handleE(e: EventTarget) {
	return e as HTMLElement
}

export function clickOutside(node: Node) {
	const handleClick = (event) => {
		if (!node.contains(event.target) && node !== event.target) {
			node.dispatchEvent(new CustomEvent("outclick"))
		}
	}

	document.addEventListener("click", handleClick, true)

	return {
		destroy() {
			document.removeEventListener("click", handleClick, true)
		}
	}
}
