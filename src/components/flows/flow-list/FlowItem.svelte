<script lang="ts">
	import Button from "../../ui/Button.svelte";
	import Icon from "../../ui/Icon.svelte";

	import { selectedFlow, activePage } from "../../../scripts/platform/stores";

	import { _flows } from "src/scripts/platform/platform";

	import { slide, fade } from "svelte/transition";
	export let flow: Flow;

	let showInfo: boolean = false;
	let showDelete: boolean = false;
</script>

<div
	class="flow-item"
	class:active={showDelete === true || showInfo === true}
>
	<div class="flow-title-row">
		<div
			class="flow-name"
			on:click={() => selectedFlow.set(flow)}
		>
			{flow.name}
		</div>
		<div class="flow-info-buttons">
			<Button
				icon="info"
				size="sm"
				style="minimal"
				color="blue"
				on:click={() => {
					showInfo = !showInfo;
					showDelete = false;
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
					showDelete = true;
					showInfo = false;
				}}
			/>
		</div>
		<div class="chevron">
			<Icon
				icon="chevronRight"
				color="inherit"
				size={16}
			/>
		</div>
	</div>
	{#if showInfo}
		<div
			class="flow-info"
			transition:slide={{ duration: 200 }}
		>
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
			<div class="cap-count">
				<div class="cap-count-label">
					Captures
				</div>
				<div class="cap-count-number">
					{flow.captureCount}
				</div>
			</div>
		</div>
	{:else if showDelete}
		<div
			class="flow-delete"
			transition:slide={{ duration: 200 }}
		>
			<div class="flow-delete-text">
				<p>Are you sure?</p>
			</div>
			<div class="flow-delete-buttons">
				<Button
					text="Delete"
					color="red"
					style="primary"
					size="sm"
					on:click={() => {
						_flows.delete(flow.id);
					}}
				/>
				<Button
					text="Cancel"
					color="blue"
					style="outline"
					size="sm"
					on:click={() => {
						showDelete = false;
					}}
				/>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;
	.flow-item {
		@include flex(column, flex-start, flex-start);
		cursor: pointer;
		outline: none;
		transition: 200ms ease;
		border-radius: $border-radius;
		width: 100%;
		box-sizing: border-box;
		z-index: 1;
		.flow-title-row {
			@include flex(row, flex-start, center);
			width: 100%;
			.flow-name {
				@include ui-text(var(--text) !important, 0.875rem, 400);
				width: 100%;
				padding: $p12;
				box-sizing: border-box;
			}
			.flow-info-buttons {
				@include flex(row, flex-start, center);
				opacity: 0;
				transition: $transition;
			}
			.chevron {
				opacity: 0;
				color: var(--text-secondary);
				transition: $transition;
			}
		}
		.flow-info {
			@include flex(row, flex-start, flex-end);
			gap: 0.75rem;
			padding: 0 0.75rem 0.75rem 0.75rem;
			.flow-defaultdb {
				@include flex(row, center, center);
				padding: $p4 $p8;
				border-radius: $p3;
				border: 1px solid var(--border-color-secondary);
				background-color: var(--bg);
				box-sizing: border-box;
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
					@include ui-text(var(--text-secondary), 0.75rem, 400);
					margin: 0;
				}
			}
			.cap-count {
				@include flex(row, flex-start, flex-start);
				border-radius: $p3;
				overflow: hidden;
				border: 1px solid var(--border-color-secondary);
				box-sizing: border-box;
				.cap-count-label {
					@include ui-text(var(--text-secondary), 0.75rem, 400);
					padding: $p4 $p8;
					background-color: var(--bg);
				}
				.cap-count-number {
					@include ui-text(var(--text), 0.75rem, 400);
					padding: $p4 $p8;
					background-color: var(--bg-quaternary);
				}
			}
		}
		.flow-delete {
			@include flex(row, space-between, center);
			padding: 0 $p12;
			width: 100%;
			box-sizing: border-box;
			.flow-delete-text {
				@include ui-text(var(--text-secondary), 0.75rem, 500);
			}
			.flow-delete-buttons {
				@include flex(row, flex-start, center);
				column-gap: $p6;
				> * {
					margin-left: $p6;
				}
			}
		}

		&.active {
			background-color: var(--bg-secondary);
			z-index: 2;
			.flow-info-buttons {
				opacity: 1;
			}
			.chevron {
				opacity: 0.8;
				padding-right: $p12;
			}
		}
		&:hover {
			background-color: var(--bg-secondary);
			.flow-info-buttons {
				opacity: 1;
			}
			.chevron {
				opacity: 0.8;
				padding-right: $p12;
			}
		}
	}
</style>
