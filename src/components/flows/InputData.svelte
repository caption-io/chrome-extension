<script lang="ts">
	import Icon from "../ui/Icon.svelte";

	import { inputManifest } from "src/scripts/provider_manifest";
	import { onLoadInputData } from "src/scripts/platform/stores";

	import { fly, slide, fade } from "svelte/transition";
	import { compatibleDataTypes } from "src/scripts/platform/platform";

	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let prop;
	export let savedInput;
	let activeTab = $onLoadInputData[0].id;
	let open = false;
	let compat = prop.showAllCompatible ? "compat" : "exact";
	let flyDirection = 300;
	let showCompatible = false;
	let compatButton;
	// type check data if InputGroup or InputItem
	function isInputGroup(data: any): data is InputGroup {
		return data.label !== undefined;
	}

	function handleTabClick(tabId) {
		if (
			inputManifest.findIndex((t) => t.id === activeTab) >
			inputManifest.findIndex((t) => t.id === tabId)
		) {
			flyDirection = -300;
			activeTab = tabId;
		} else {
			flyDirection = 300;
			activeTab = tabId;
		}
	}

	function inputSelected(item: InputItem, data: InputGroup) {
		dispatch("selected", {
			inputItem: item,
			inputItemGroup: data,
			inputItemProvider: inputManifest.find((p) => p.id === activeTab),
		});
	}
</script>

<div
	class="input-data-container"
	transition:slide={{ duration: 200 }}
>
	<div class="tab-container">
		{#each inputManifest as tab}
			<div
				class="tab"
				class:active={activeTab === tab.id}
				on:click={() => handleTabClick(tab.id)}
			>
				<div class="tab-icon">
					<Icon
						icon={tab.icon}
						color="inherit"
						size={12}
					/>
				</div>
				<div class="tab-text">{tab.name}</div>
			</div>
		{/each}
	</div>
	<div class="view-options">
		<div
			class="show-compat"
			class:showCompatible
			on:click={() => (showCompatible = !showCompatible)}
		>
			<div class="checkbox">
				<div class="checkmark">
					<Icon
						icon="check"
						color="inherit"
						size={10}
					/>
				</div>
			</div>
			Show all compatible
		</div>
	</div>
	<div class="input-data-selector">
		{#if $onLoadInputData.find((p) => p.id === activeTab).data.length > 0}
			{#each $onLoadInputData.find((p) => p.id === activeTab).data as data}
				{#if isInputGroup(data)}
					{#if compatibleDataTypes(data.type, prop.type).exact}
						<div class="input-group">
							<div class="input-group-label">
								{data.label}
							</div>
							{#each data.items as item}
								<div
									class="input-item"
									on:click={() => inputSelected(item, data)}
								>
									<div class="input-item-value">
										{item.item}
									</div>
									<div class="input-item-source">
										{item.source[0]}
									</div>
								</div>
							{/each}
						</div>
					{/if}

					{#if showCompatible && compatibleDataTypes(data.type, prop.type).compat}
						<div
							class="input-group"
							transition:fade={{ duration: 200 }}
						>
							<div class="input-group-label">
								{data.label}
							</div>
							{#each data.items as item}
								<div
									class="input-item"
									on:click={() => inputSelected(item, data)}
								>
									<div class="input-item-value">
										{item.item}
									</div>
									<div class="input-item-source">
										{item.source[0]}
									</div>
								</div>
							{/each}
						</div>
					{/if}
				{:else}
					Item: {data.item}
				{/if}
			{/each}
		{:else}
			<div
				class="no-data"
				in:fly={{ duration: 200, x: flyDirection }}
			>
				No data recieved
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	@use "src/style/global" as *;
	.input-data-container {
		@include flex(column, flex-start, center);
		width: 100%;
		border-radius: $p8;
		border: 1px solid var(--border-color);
		background-color: var(--bg-secondary);
		box-sizing: border-box;
		overflow: hidden;
		margin-top: $p12;
		box-shadow: var(--input-shadow-heavy);
		.tab-container {
			@include flex(row, flex-start, flex-end);
			box-sizing: border-box;
			width: 100%;
			padding: $p6 $p6 0 $p6;
			z-index: 1;
			.tab {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: $p8 $p12;
				transition: $transition;
				cursor: pointer;
				box-sizing: border-box;
				border-radius: $p4;
				@include ui-text(var(--text-secondary), $p12, 400);
				.tab-icon {
					margin-right: $p3;
				}
				.tab-text {
					white-space: nowrap;
				}
				&.active {
					background-color: var(--bg);
					color: var(--blue);
					box-shadow: var(--input-shadow-light);
				}
			}
		}
		.view-options {
			@include flex(row, flex-end, center);
			width: 100%;
			padding: 0 $p12;
			box-sizing: border-box;
			border-bottom: 1px solid var(--border-color-secondary);
			.show-compat {
				@include flex(row, center, center);
				@include ui-text(var(--text-secondary), $p12, 400);
				padding: $p8 $p6;
				transition: $transition;
				align-self: flex-end;
				cursor: pointer;
				.checkbox {
					margin-right: $p6;
					border: 1px solid var(--border-color);
					border-radius: $p2;
					width: $p12;
					height: $p12;
					color: var(--bg-secondary);
					background-color: var(--bg-secondary);
					transition: $transition;
					box-sizing: border-box;
					.checkmark {
						display: none;
					}
				}
				&:hover {
					color: var(--text);
					.checkbox {
						border: 1px solid var(--blue);
						color: var(--blue);
						background-color: var(--blue-light);
					}
				}
				&.showCompatible {
					.checkbox {
						@include flex(row, center, center);
						color: var(--white);
						border: 1px solid var(--blue);
						background-color: var(--blue);
						.checkmark {
							display: block;
						}
					}
				}
			}
		}
		.input-data-selector {
			@include flex(column, flex-start, flex-start);
			@include scrollbar();
			padding: $p12 $p12 $p12 $p12;
			max-height: 250px;
			width: 100%;
			box-sizing: border-box;
			overflow-y: overlay;
			overflow-x: hidden;
			position: relative;
			background-color: var(--bg);
			.input-group {
				margin-bottom: $p12;
				width: 100%;
				.input-group-label {
					@include ui-text(var(--text-secondary), $p12, 500);
					margin: 0 0 $p6 $p6;
				}
				.input-item {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: flex-start;
					margin-bottom: $p6;
					padding: $p12;
					border-radius: $p4;
					cursor: pointer;
					width: 100%;
					box-sizing: border-box;
					border: 1px solid var(--border-color-secondary);
					background-color: var(--bg-quaternary);
					transition: 100ms ease-in-out;
					.input-item-value {
						@include ui-text(var(--text), $p14, 400);
						font-size: 0.875rem;
						margin-bottom: 0.375rem;
						width: 100%;
						padding-right: 12px;
						overflow: hidden;
						text-overflow: ellipsis;
						box-sizing: border-box;
						transition: 100ms ease-in-out
					}
					.input-item-source {
						@include ui-text(var(--text-secondary), $p12, 400);
						transition: $transition;
						align-self: flex-end;
						opacity: 0.75;
					}
					&:hover {
						box-shadow: var(--input-shadow-light);
						.input-item-value {
							color: var(--blue);
						}
					}
				}
			}
		}
	}
</style>
