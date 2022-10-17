<script
	context="module"
	lang="ts"
>
</script>

<!-- SECT: SCRIPT -->
<script lang="ts">
	// IMPT: Packages
	import { fly, fade } from "svelte/transition";

	// IMPT: Components
	import FlowEditor from "../flows/FlowEditor.svelte";
	import FlowList from "../flows/FlowList.svelte";

	// IMPT: Local
	import {
		flows,
		selectedFlow,
		settings,
		appExpanded,
		tags,
		maxSize,
	} from "src/scripts/platform/stores";
	import { getFlows, getSettings } from "src/scripts/platform/chrome-storage";
	import TabBar from "./TabBar.svelte";

	// VARS: Local
	let activeFlow = null;
	let userSettings: UserSettings;

	// FUNCS: Main

	// FUNC: Load Flows
	const loadFlows = async () =>
		await getFlows().then((res) => {
			flows.set(res);
			console.log("Flows loaded: ", res);
			return res;
		});

	// FUNC: Load Settings
	const loadSettings = async () =>
		await getSettings().then((res) => {
			settings.set(res);
		});

	//! FUNCS

	// FUNC: Start
	loadFlows();
	loadSettings();

	selectedFlow.subscribe((flow) => (activeFlow = flow));

	// $: items = groupBy(itemsSearch, "tags");
	settings.subscribe((settings) => {
		userSettings = settings;
	});

	browser.storage.onChanged.addListener((changes) => {
		for (let key in changes) {
			if (key === "flows") {
				loadFlows();
				console.log("Flows changed in browser storage");
			}
		}
	});
</script>

<!-- !SECT -->

<!-- SECT: MARKUP -->
<div
	class="container"
	class:expanded={$appExpanded}
>
	{#if !$selectedFlow}
		<div class="main-page" in:fade={{duration: 300, delay: 400}}>
			<FlowList />
			<TabBar />
		</div>
	{/if}
	{#if $selectedFlow}
		{#key $selectedFlow.id}
			<div
				class="flow-editor"
				transition:fly={{ x: 400, duration: 400 }}
				class:expanded={$appExpanded}
				style="max-height: {$maxSize.height - 107}px"
			>
				<FlowEditor
					{...$selectedFlow}
					storedFlow={$selectedFlow}
					on:flowUpdated{loadFlows()}
				/>
			</div>
		{/key}
	{/if}
</div>

<!-- SECT: STYLE -->
<style lang="scss">
	@use "src/style/global" as *;

	@keyframes blurin {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
	.container {
		@include flex(row, flex-start, stretch);
		position: relative;
		width: 100%;
		height: fit-content;
		.main-page {
			@include flex(column, flex-start, stretch);
			width: 100%;
		}
		&.expanded {
			@include flex(row, flex-start, stretch);
		}
		.flow-editor {
			@include flex(column, flex-start, stretch);
			width: 100%;
			height: 100%;
			&.expanded {
			}
		}
	}

	.handle {
		border-radius: 0.3rem;
		&:hover {
			background: var(--bg-darker);
		}
	}

	.options-container {
		display: flex;
		flex-direction: row;
		column-gap: 8px;
		padding: 0.75rem 1rem;
		background: var(--bg-500);
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid var(--border-color-light);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.04) inset;
	}

	.no-flows {
		flex-grow: 1;
		font-size: 1rem;
		font-weight: 600;
		min-height: 4rem;
		width: 100%;
		color: var(--grey-600);
		@include flex(row, center, center);
	}
</style>
