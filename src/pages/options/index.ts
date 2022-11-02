import Auth from 'src/components/Auth.svelte'

function loadPopup() {
	const app = new Auth({
		target: document.body,
	})
}

document.addEventListener('DOMContentLoaded', loadPopup)

