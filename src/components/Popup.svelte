<script lang="ts">
	import Organizer from "./Organizer.svelte";
	import Auth from "./Auth.svelte";
	import { webData, colorMode, settings } from "../scripts/stores";
	import { getSettings } from "../scripts/chrome-storage";

	let userLoggedIn: boolean = false;

	// FUNC: Load Settings
	(async function loadSetting() {
		await getSettings().then((res) => {
			settings.set({
				...res,
			});
			if ($settings.notionToken !== null) {
				userLoggedIn = true;
				console.log("User logged in with token: ", $settings.notionToken);
			} else {
				userLoggedIn = false;
				console.log("User not logged in, token: ", $settings.notionToken);
				//open options page
			}
		});
	})();

	(async function getCurrentTab() {
		let queryOptions = { active: true, lastFocusedWindow: true };
		let [tab] = await browser.tabs.query(queryOptions);
		const tabInfo = {
			id: { text: "Id", value: tab.id },
			textValues: {
				none: { text: "None", value: "none", icon: "none" },
				title: { text: "Page Title", value: tab.title, icon: "title" },
				url: { text: "Page URL", value: tab.url, icon: "url" },
				favicon: {
					text: "Icon URL",
					value: tab.favIconUrl,
					icon: "image",
				},
			},
		};
		webData.set(tabInfo);
	})();

	// browser.tabs.executeScript({
	// 	file: "src/content/index.js",
	// });
</script>

<div class={`container ${$colorMode}`}>
	{#if !userLoggedIn}
		<Auth />
	{:else}
		<Organizer />
	{/if}
</div>

<style global lang="scss">
	@use "../style/global" as *;

	@keyframes widen {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	.container {
		display: flex;
		flex-direction: column;
		min-width: 400px;
		height: auto;
		pointer-events: all;
		overflow: hidden;
		animation: widen 600ms ease-in-out forwards;
		transform-origin: top center;
		transition: 200ms ease-in-out;
	}
</style>
