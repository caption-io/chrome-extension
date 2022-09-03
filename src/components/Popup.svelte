<script lang="ts">
	import Flow from './Flow.svelte'
	import Organizer from './Organizer.svelte'
	import { webData, colorMode } from '../scripts/stores'

	let webDataValue
	;(async function getCurrentTab() {
		let queryOptions = { active: true, lastFocusedWindow: true }
		let [tab] = await browser.tabs.query(queryOptions)
		const tabInfo = {
			id: { text: 'Id', value: tab.id },
			textValues: {
				none: { text: 'None', value: 'none', icon: 'none' },
				title: { text: 'Page Title', value: tab.title, icon: 'title' },
				url: { text: 'Page URL', value: tab.url, icon: 'url' },
				favicon: { text: 'Icon URL', value: tab.favIconUrl, icon: 'image' },
			},
		}
		webData.set(tabInfo)
		console.log(tab)
	})()

	let selectedFlow

	function handleClick(e) {
		console.log(e)
	}
</script>

<div class={`container ${$colorMode}`}>
	{#if !selectedFlow}
		<Organizer />
	{:else}
		<Flow />
	{/if}
</div>

<style lang="sass">
	@use '../style/global'
	.container
		display: flex
		flex-direction: column
		width: 400px
		height: auto
		pointer-events: all
</style>
