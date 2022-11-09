<!-- SECT: SCRIPT -->
<script lang="ts">
	// IMPORTS

	// IMPT: Components
	import Icon from "src/components/ui/Icon.svelte";
	import TextInput from "src/components/ui/TextInput.svelte";
	import Button from "src/components/ui/Button.svelte";
	import FlowItem from "./FlowItem.svelte";

	// IMPT: Stores
	import {
		appExpanded,
		maxSize,
		flowStore,
		selectedFlow,
		activePage,
	} from "src/scripts/platform/stores";

	// IMPT: Local Scripts
	import { _flows } from "src/scripts/platform/platform";

	//! IMPORTS

	// VARIABLES

	// VARS: Local State
	let showInfo = false;
	let searchQuery: string = null;
	let searchFlowList;

	//! VARIABLES

	// FUNCTIONS

	$: searchFlowList = $flowStore.filter((flow) => {
		if (!searchQuery) return;
		return flow.name.toLowerCase().includes(searchQuery.toLowerCase());
	});

	_flows.load();
</script>

<!-- !SECT -->

<!-- SECT: MARKUP -->
<div
	class="flow-list"
	class:expanded={$appExpanded}
	style={`max-height: ${$maxSize.height - 92}px; max-width: ${$maxSize.width}`}
>
	<div class="header">
		<TextInput
			placeholder="Search"
			bind:value={searchQuery}
			icon="search"
			type="text"
		/>
		<div class="options-container">
			<Button
				icon="view"
				size="sm"
				style="minimal"
				color="blue"
			/>
			<Button
				icon="sort"
				size="sm"
				style="minimal"
				color="blue"
			/>
			<Button
				icon="add"
				size="sm"
				style="minimal"
				color="blue"
				on:click={_flows.create}
			/>
		</div>
	</div>
	{#if $flowStore.length !== 0}
		<div class="list">
			{#each $flowStore as flow (flow.id)}
				<FlowItem
					flow={flow}
					/>
			{/each}
		</div>
	{:else}
		<div class="no-flows">No flows found.</div>
	{/if}
</div>
<!-- !SECT -->

<!-- !SECT -->

<!-- SECT: STYLE -->
<style lang="scss">
	@use "src/style/global" as *;
	.flow-list {
		@include flex(column, center, center);
		width: 100%;
		flex-grow: 1;
		position: relative;
		background-color: var(--bg);
		padding-bottom: 0.75rem;
		box-sizing: border-box;

		&.expanded {
			height: 100%;
			border-right: 1px solid var(--bg-200);
		}

		.header {
			@include flex(column, flex-start, center);
			row-gap: $p12;
			width: 100%;
			box-sizing: border-box;
			flex-shrink: 1;
			padding: $p12;
			.options-container {
				@include flex(row, flex-end, center);
				width: 100%;
				justify-content: flex-end;
				row-gap: 0.5rem;
			}
			.header-top {
				@include flex(row, center, center);
				width: 100%;
			}

			h1 {
				&.header-text {
					@include ui-text(var(--blue), 1rem, 500);
				}
				margin: 0 0 0 0;
				padding: 0;
			}
		}

		.list {
			@include scrollbar();
			flex-grow: 1;
			width: 100%;
			overflow-y: auto;
			height: auto;
			transition: 200ms ease;
			box-sizing: border-box;
			box-shadow: 0 $p12 $p12 0 var(--shadow-color-light) inset,0 -0.75rem $p12 0 var(--shadow-color-light) inset;
			padding: $p12;
		}
	}
</style>
