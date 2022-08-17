<script lang="ts">
	import Flow from './Flow.svelte';
	import Header from './Header.svelte';
	import { webData } from '../scripts/stores';

	let webDataValue;

	(async function getCurrentTab() {
		let queryOptions = { active: true, lastFocusedWindow: true };
		let [tab] = await browser.tabs.query(queryOptions);
		const tabInfo = {
			id: { text: 'Id', value: tab.id },
			textValues: {
                none: {text: 'None', value: 'none', icon: 'none'},
				title: { text: 'Page Title', value: tab.title, icon: 'title' },
				url: { text: 'Page URL', value: tab.url, icon: 'url' },
				favicon: { text: 'Icon URL', value: tab.favIconUrl, icon: 'image' },
			},
		};
		webData.set(tabInfo);
        console.log(tab);
	})();

</script>

<div class="container light-mode">
	<Flow />
</div>

<style lang="less">
	.container {
		display: flex;
		flex-direction: column;
		row-gap: 16px;
		width: 400px;
        max-width: 400px;
        pointer-events: all;
	}
</style>
