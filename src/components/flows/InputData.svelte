<script lang="ts">
	import Icon from "../ui/Icon.svelte";

	import { inputManifest } from "src/scripts/provider_manifest";
	import { onLoadInputData } from "src/scripts/platform/stores";

	import { fly, slide } from "svelte/transition";
	import { compatibleDataTypes } from "src/scripts/platform/platform";

	export let prop;
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
						color="blue"
						size={12}
					/>
				</div>
				<div class="tab-text">{tab.name}</div>
			</div>
		{/each}
	</div>
	<div class="input-data-selector">
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
		{#if $onLoadInputData.find((p) => p.id === activeTab).data.length > 0}
			{#each $onLoadInputData.find((p) => p.id === activeTab).data as data}
				{#if isInputGroup(data)}
					{#if compatibleDataTypes(data.type, prop.type).exact}
						<div class="input-group">
							<div class="input-group-label">
								{data.label}
							</div>
							{#each data.items as item}
								<div class="input-item">
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
						<div class="input-group">
							<div class="input-group-label">
								{data.label}
							</div>
							{#each data.items as item}
								<div class="input-item">
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
		border: 1px solid var(--blue);
		background-color: var(--blue-light);
		box-sizing: border-box;
		overflow: hidden;
		margin-top: $p12;
		.tab-container {
			@include flex(row, flex-start, flex-end);
			box-sizing: border-box;
			width: 100%;
			.tab {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: $p8 $p12;
				transition: $transition;
				cursor: pointer;
				box-sizing: border-box;
				.tab-icon {
					margin-right: $p3;
				}
				.tab-text {
					@include ui-text(var(--blue), $p12, 500);
					white-space: nowrap;
				}
				&.active {
					background-color: var(--bg);
				}
			}
		}
		.input-data-selector {
			@include flex(column, flex-start, flex-start);
			@include scrollbar();
			padding: $p12;
			max-height: 250px;
			width: 100%;
			box-sizing: border-box;
			background-color: var(--bg);
			overflow-y: overlay;
			overflow-x: hidden;
			position: relative;
			.input-group {
				margin-bottom: $p12;
				width: 100%;
				.input-group-label {
					@include ui-text(var(--text-secondary), $p12, 500);
					text-transform: uppercase;
					margin: 0 0 $p6 $p12;
				}
				.input-item {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					justify-content: flex-start;
					margin-bottom: $p6;
					padding: $p6 $p12;
					border-radius: var(--border-radius);
					cursor: pointer;
					transition: $transition;
					background-color: var(--bg-secondary);
					width: 100%;
					box-sizing: border-box;
					.input-item-value {
						@include ui-text(var(--text), $p14, 500);
						transition: $transition;
						font-size: 0.875rem;
						margin-bottom: 0.375rem;
						width: 100%;
						padding-right: 12px;
						overflow: hidden;
						text-overflow: ellipsis;
						box-sizing: border-box;
					}
					.input-item-source {
						@include ui-text(var(--text-secondary), $p12, 500);
						transition: $transition;
						align-self: flex-end;
					}
					&:hover {
						background-color: var(--blue-light);
						.input-item-value {
							color: var(--blue);
						}
						.input-item-source {
							color: var(--blue);
							opacity: 0.6;
						}
					}
				}
			}
			.show-compat {
				@include flex(row, center, center);
				@include ui-text(var(--text-secondary), $p12, 500);
				border-radius: var(--border-radius);
				padding: $p6 $p6;
				transition: $transition;
				align-self: flex-end;
				cursor: pointer;
				background-color: var(--bg-secondary);
				position: sticky;
				top: 0;
				right: 0;
				z-index: 99;
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
	}
</style>
