import Popup from 'src/components/Popup.svelte'

function loadPopup() {
	const app = new Popup({
		target: document.body,
	})
}

document.addEventListener('DOMContentLoaded', loadPopup)



function scrollToElement(element) {
	// if element is not completely visible in .props-main, smoothly scroll container .props-main to make it visible

	const container = document.querySelector('.props-main')
	const containerRect = container.getBoundingClientRect()
	const elementRect = element.getBoundingClientRect()

	if (elementRect.top < containerRect.top) {
		container.scrollTo({
			top: elementRect.top - containerRect.top + container.scrollTop + 16,
			behavior: 'smooth'
		})
	} else if (elementRect.bottom > containerRect.bottom) {
		container.scrollTo({
			top: elementRect.bottom - containerRect.bottom + container.scrollTop + 16,
			behavior: 'smooth'
		})
	}

	// if element bottom is at the bottom of the container, add bottom padding to container

}





// watch for .sv-dropdown elements being added to the DOM, or exiting .sv-dropdowns aria-expanded attributes becoming true and scroll to them
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.type === 'childList') {
			mutation.addedNodes.forEach((node) => {
				if (node.classList && node.classList.contains('sv-dropdown')) {
					scrollToElement(node)
				}
			})
		} else if (mutation.type === 'attributes') {
			if (mutation.target.classList.contains('sv-dropdown') && mutation.target.getAttribute('aria-expanded') === 'true') {
				scrollToElement(mutation.target)
			}
		}
	})
})

observer.observe(document.body, {
	childList: true,
	subtree: true,
	attributes: true,
	attributeFilter: ['aria-expanded'],
})




