<!-- SECT: SCRIPT -->
<script lang="ts">
	// IMPORTS

	// IMPT: Components
	import Icon from "src/components/ui/Icon.svelte";
	import TextInput from "src/components/ui/TextInput.svelte";
	import Button from "src/components/ui/Button.svelte";

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
	style={`max-height: ${$maxSize.height}px; max-width: ${$maxSize.width}`}
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
					<div class="flow-item">
						<div class="flow-title-row">
							<div
								class="flow-name"
								on:click={() => selectedFlow.set(flow)}
							>
								{flow.name}
							</div>
							<div class="flow-info-button">
								<Button
									icon="info"
									size="sm"
									style="minimal"
									color="blue"
									on:click={() => {
										showInfo = !showInfo;
									}}
								/>
								<Button
									icon="cog"
									size="sm"
									style="minimal"
									color="blue"
									on:click={() => {
										selectedFlow.set(flow);
										activePage.set("flowSettings");
									}}
								/>
								<Button
									icon="trash"
									size="sm"
									style="minimal"
									color="red"
									on:click={() => {
										
									}}
								/>
							</div>
							<div class="chevron">
								<Icon
									icon="chevronRight"
									color="gray"
									size={16}
								/>
							</div>
						</div>
						{#if showInfo}
							<div class="flow-info">
								<div class="flow-defaultdb">
									{#if flow.defaultDestination}
										<div class="flow-defaultdb-icon">
											{#if flow.defaultDestination.icon}
												<img
													src={flow.defaultDestination.icon.toString()}
													alt="icon"
												/>
											{:else}
												<Icon
													icon="doc"
													size={14}
													color="gray"
												/>
											{/if}
										</div>
										<p class="flow-defaultdb-name">
											{flow.defaultDestination.name}
										</p>
									{:else}
										<p class="flow-defaultdb-name">No Default Database</p>
									{/if}
								</div>
							</div>
						{/if}
					</div>
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
		overflow-y: hidden;
		overflow-x: visible;
		background-color: var(--bg);
		padding-bottom: 0.75rem;
		box-sizing: border-box;

		&.expanded {
			height: 100%;
			border-right: 1px solid var(--bg-200);
		}

		.header {
			@include flex(column, flex-start, center);
			padding: $p12 0;
			row-gap: $p12;
			width: 100%;
			box-sizing: border-box;
			flex-shrink: 1;
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
			background-color: var(--bg-secondary);
			border-radius: $border-radius;
			.flow-item {
				@include flex(column, flex-start, flex-start);
				cursor: pointer;
				outline: none;
				transition: 200ms ease;
				border-radius: $border-radius;
				width: 100%;
				box-sizing: border-box;
				.flow-title-row {
					@include flex(row, flex-start, center);
					width: 100%;
					.flow-name {
						@include ui-text(var(--text) !important, 0.875rem, 600);
						width: 100%;
						padding: $p12;
						box-sizing: border-box;
					}
					.flow-info-button {
						@include flex(row, flex-start, center);
						opacity: 0;
						transition: $transition;
					}
					.chevron {
						opacity: 0;
						transition: $transition;
					}
				}
				.flow-info {
					@include flex(column, flex-start, flex-start);
					padding: 0 $p12 $p12 $p12;

					.flow-defaultdb {
						@include flex(row, center, center);
						.flow-defaultdb-icon {
							@include flex(row, center, center);
							margin-right: $p3;
							img {
								width: 0.75rem;
								height: 0.75rem;
								border-radius: 0.2rem;
								opacity: 0.7;
							}
						}
						.flow-defaultdb-name {
							@include ui-text(var(--text-tertiary), 0.75rem, 400);
						}
					}
				}

				&:hover {
					background-color: var(--bg-tertiary);
					.flow-info-button {
						opacity: 1;
					}
					.chevron {
						opacity: 0.8;
						padding-right: $p12;
					}
				}
			}
		}
	}
</style>
