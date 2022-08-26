<script lang="ts">
	import Flow from './Flow.svelte';
    import OrgTest from './OrgTest.svelte';
	import { webData, colorMode } from '../scripts/stores';
	import Select from './ui/Select.svelte';
	import Button from './ui/Button.svelte';

	let webDataValue;

	(async function getCurrentTab() {
		let queryOptions = { active: true, lastFocusedWindow: true };
		let [tab] = await browser.tabs.query(queryOptions);
		const tabInfo = {
			id: { text: 'Id', value: tab.id },
			textValues: {
				none: { text: 'None', value: 'none', icon: 'none' },
				title: { text: 'Page Title', value: tab.title, icon: 'title' },
				url: { text: 'Page URL', value: tab.url, icon: 'url' },
				favicon: { text: 'Icon URL', value: tab.favIconUrl, icon: 'image' },
			},
		};
		webData.set(tabInfo);
		console.log(tab);
	})();

	const tempOptions = [
		{
			text: 'Page Title',
			value: 'title',
		},
		{
			text: 'Page URL',
			value: 'url',
			icon: 'url',
		},
		{
			text: 'Icon URL',
			value: 'favicon',
		},
	];

	let selectedFlow;

	function handleClick(e) {
		console.log(e);
	}
</script>

<div class={`container ${$colorMode}`}>
    {#if !selectedFlow}
    <OrgTest />
    {:else}
	<Flow />
    {/if}
</div>

<style lang="less">
	.container {
		display: flex;
		flex-direction: column;
		width: 400px;
		max-width: 400px;
        height: auto;
		pointer-events: all;
	}
</style>
