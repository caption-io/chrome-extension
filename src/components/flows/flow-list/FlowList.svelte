<!-- SECT: SCRIPT -->
<script lang="ts">
	// IMPORTS

	// IMPT: Components
	import Icon from "src/components/ui/Icon.svelte";
	import TextInput from "src/components/ui/TextInput.svelte";
	import Button from "src/components/ui/Button.svelte";
	import Radio from "src/components/ui/Radio.svelte";
	import FlowItem from "./FlowItem.svelte";

	// IMPT: Stores
	import {
		appExpanded,
		maxSize,
		flowStore,
		selectedFlow,
		activePage,
		tagStore,
	} from "src/scripts/platform/stores";

	// IMPT: Local Scripts
	import { _flows } from "src/scripts/platform/platform";

	import { flip } from "svelte/animate";
	import { fade, slide } from "svelte/transition";
	import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
	import { each } from "svelte/internal";

	//! IMPORTS

	// VARIABLES

	// VARS: Local State
	let showInfo = false;
	let searchQuery: string = null;
	let searchFlowList;
	let showViewOptions: boolean = false;

	//! VARIABLES

	// FUNCTIONS

	$: searchFlowList = $flowStore.filter((flow) => {
		if (!searchQuery) return;
		return flow.name.toLowerCase().includes(searchQuery.toLowerCase());
	});

	_flows.load();

	let flowList = [];

	$: if ($tagStore) {
		let uncategorizedFlows = {
			id: "uncategorized",
			name: "Uncategorized",
			flows: $flowStore.filter((flow) => {
				return !flow.tags || flow.tags.length == 0;
			}),
		};

		let taggedFlows = $tagStore.map((tag) => {
			return {
				id: tag.id,
				name: tag.name,
				flows: $flowStore.filter((flow) => flow.tags.includes(tag.id)),
			};
		});
		flowList = [uncategorizedFlows, ...taggedFlows];
	}

	// let flipDurationMs = 200;
	// let draggedItemInfo;
	// function handleDndConsider(e, tid) {
	// 	const tagIdx = flowList.findIndex((t) => t.id === tid);
	// 	flowList[tagIdx].flows = e.detail.items;
	// 	flowList = [...flowList];
	// }
	// $: console.log("FLOWS CHANGED: ", flowList);

	// function handleDndFinalize(e, tid) {
	// 	const tagIdx = flowList.findIndex((t) => t.id === tid);
	// 	flowList[tagIdx].flows = e.detail.items;
	// 	flowList = [...flowList];
	// 	saveFlowOrder();
	// }

	// function saveFlowOrder() {
	// 	let flowOrder = [];
	// 	flowList.forEach((tag) => {
	// 		tag.flows.forEach((flow) => {
	// 			flowOrder.push(flow);
	// 		});
	// 	});
	// 	_flows.saveAll(flowOrder);
	// }
</script>

<!-- !SECT -->

<!-- SECT: MARKUP -->
<div
	class="flow-list-page"
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
				icon="eye_open"
				size="sm"
				style="secondary"
				color={showViewOptions ? "blue" : "gray"}
				on:click={() => (showViewOptions = !showViewOptions)}
			/>
			<Button
				text="Flow"
				icon="add"
				size="sm"
				style="secondary"
				color="blue"
				on:click={_flows.create}
			/>
		</div>
		{#if showViewOptions}
		<div class="options-container views" transition:slide={{duration: 200}}>
			<div class="option">
				<div class="option-label">View</div>
				<Radio
					options={[
						{
							name: "All",
							id: "all",
							icon: "view",
						},
						{
							name: "Folder",
							id: "folder",
							icon: "folder",
						},
						{
							name: "Tags",
							id: "tags",
							icon: "tag",
						},
					]}
					value="all"
					name="views"
					iconOnly={true}
					asColumn={false}
				/>
			</div>
			<div class="option">
				<div class="option-label">Sort</div>
				<Radio
					options={[
						{
							name: "Title",
							id: "title",
							icon: "title",
						},
						{
							name: "Destination",
							id: "destination",
							icon: "database",
						},
						{
							name: "Recent",
							id: "recent",
							icon: "refresh",
						},
					]}
					value="title"
					name="sorts"
					iconOnly={false}
					asColumn={false}
				/>
			</div>
		</div>
		{/if}
	</div>
	<div class="list">
		{#if $flowStore.length !== 0 && flowList.length !== 0}
			{#each flowList as tagLabel (tagLabel.id)}
				<div class="tag-label-header">
					<div class="tag-label-text">
						<span class="prefix">#</span>{tagLabel.name}
					</div>
					<div class="tag-label-chevron">
						<Icon
							icon="chevronRight"
							size={16}
							color="inherit"
						/>
					</div>
				</div>
				<div
					class="flow-list"
					class:open={tagLabel.expanded}
					id={tagLabel.id}
				>
					{#each tagLabel.flows as flow (flow.id)}
						<FlowItem {flow} />
					{/each}
				</div>
			{/each}
		{:else}
			<div class="no-flows">No flows found.</div>
		{/if}
	</div>
</div>
<!-- !SECT -->

<!-- !SECT -->

<!-- SECT: STYLE -->
<style lang="scss">
	@use "src/style/global" as *;
	.flow-list-page {
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
			row-gap: $p16;
			width: 100%;
			box-sizing: border-box;
			flex-shrink: 1;
			padding: $p16 $p12;
			.options-container {
				@include flex(row, flex-end, flex-end);
				width: 100%;
				gap: 0.5rem;
				.option {
					@include flex(column, flex-start, flex-start);
					gap: 0.25rem;
					width: 100%;
					.option-label {
						@include ui-text(var(--text-secondary), $p10, 500);
						text-transform: uppercase;
						margin-left: $p6;
					}
				}
			}
			.header-top {
				@include flex(row, center, center);
				width: 100%;
			}

			h1 {
				&.header-text {
					@include ui-text(var(--blue), 1rem, 400);
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
			padding: 0 $p24;
			background-color: var(--bg-quaternary);
			.tag-label-header {
				@include flex(row, space-between, center);
				@include ui-text(var(--text-secondary), $p14, 400);
				padding: $p12 0;
				width: 100%;
				box-sizing: border-box;
				flex-shrink: 1;
				.tag-label-text {
					@include flex(row, flex-start, center);
					.prefix {
						color: var(--gray);
						margin-right: $p3;
					}
				}
				.tag-label-chevron {
					@include flex(row, center, center);
					transition: 200ms ease;
					transform: rotate(0deg);
					color: var(--text-secondary);
					&.open {
						transform: rotate(90deg);
					}
				}
			}
			.flow-list {
				@include flex(column, center, center);
				padding: 0 $p12 $p6 $p12;
				margin: 0 0 12px 0;
			}
		}
	}
</style>
