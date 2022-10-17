<script lang="ts">
	import Icon from "src/components/ui/Icon.svelte";
	import TextInput from "src/components/ui/TextInput.svelte";
	import Button from "src/components/ui/Button.svelte";
	import {
		appExpanded,
		maxSize,
		flows,
		selectedFlow,
	} from "src/scripts/platform/stores";
	import { loadFlows, newFlow } from "src/scripts/platform/flows-scripts";

	let displayedFlowList;

	// search handler
	let searchQuery: string = null;
	let searchFlowList;
	$: searchFlowList = $flows.filter((flow) => {
		if (!searchQuery) return;
		return flow.name.toLowerCase().includes(searchQuery.toLowerCase());
	});

	loadFlows();


</script>

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
				text="New Flow"
				icon="flowPlus"
				iconPosition="left"
				size="sm"
				style="primary"
				color="blue"
				fill
				on:click={newFlow}
			/>
		</div>
	</div>
	{#if $flows.length !== 0}
		<div class="list">
			{#each $flows as flow (flow.id)}
				{#if $flows.includes(flow)}
					<div
						class="flow-item"
						on:click={() => selectedFlow.set(flow)}
					>
						<div class="handle">
							<Icon
								name="grab_handle"
								color="grey-400"
								size={14}
							/>
						</div>
						<div class="flow-info">
							<div class="flow-name">
								{flow.name}
							</div>
							<div class="flow-defaultdb">
								{#if flow.defaultDatabase}
									<div class="flow-defaultdb-icon">
										{#if flow.defaultDatabase.icon}
											<img
												src={flow.defaultDatabase.icon.toString()}
												alt="icon"
											/>
										{:else}
											<Icon
												name="doc"
												size={14}
												color="grey-400"
												position="l"
											/>
										{/if}
									</div>
									<p class="flow-defaultdb-name">
										{flow.defaultDatabase.name}
									</p>
								{:else}
									<p class="flow-defaultdb-name">No Default Database</p>
								{/if}
							</div>
						</div>
						<div class="chevron">
							<Icon
								name="chevronRight"
								color="grey"
								size={16}
								position="l"
							/>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{:else}
		<div class="no-flows">No flows found.</div>
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;
	.flow-list {
		@include flex(column, center, center);
		width: 100%;
		height: fit-content;
		position: relative;
		overflow: hidden;
		background-color: var(--bg);
		padding-bottom: 0.75rem;
		box-sizing: border-box;

		&.expanded {
			height: 100%;
			min-width: 400px;
			width: 400px;
			border-right: 1px solid var(--bg-200);
		}

		.header {
			@include flex(column, flex-start, center);
			padding: 0.75rem;
			row-gap: 0.75rem;
			width: 100%;
			box-sizing: border-box;
			flex-shrink: 1;
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
			margin: 0 1rem;
			padding: 0 0rem;
			box-sizing: border-box;
			background-color: var(--white);
			border-radius: 0.25rem;
			.flow-item {
				@include flex();
				padding: 0.5rem 0.5rem;
				cursor: pointer;
				outline: none;
				transition: 200ms ease;

				.flow-info {
					@include flex(column, flex-start, flex-start);
					margin-left: 0.75rem;
					flex-grow: 1;
					row-gap: 0.25rem;

					.flow-name {
						@include ui-text(var(--gray-600) !important, 0.875rem, 600);
					}
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
							@include ui-text(var(--gray-500), 0.75rem, 400);
						}
					}
				}
				.chevron {
					opacity: 0;
					margin-right: 0.5rem;
					transition: 100ms ease;
				}
				&:hover {
					background-color: var(--bg);
					box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.04);

					.chevron {
						opacity: 0.8;
					}
				}
			}
		}
	}
</style>
