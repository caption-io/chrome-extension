<script lang="ts">
	import { itemActions, highlightSearch, CloseButton } from "svelecte/item";
	import Icon from "./Icon.svelte";

	export let inputValue;
	export let index = -1;
	export let item: WebDataItem = null;
	export let isSelected = false;
	export let isDisabled = false;
	export let isMultiple = false;

	let icon = item.$isGroupHeader
		? item.label === "Twitter Handle" || item.label === "Twitter Link"
			? "twitter"
			: item.label === "Type"
			? "select"
			: item.label === "Youtube"
			? "video"
			: item.label === "Thumbnail"
			? "image"
			: item.label.replace(" ", "_").toLowerCase()
		:"doc";
</script>

{#if (item.text && !isSelected) || (item.label && !isSelected)}
	<div
		class="sv-item sv-wd-item"
		use:itemActions={{ item, index }}
		class:sv-wd-item-header={item.$isGroupHeader}
		on:select
		on:deselect
		on:hover
	>
		{#if item.$isGroupItem}
			<div class="sv-wd-item-content" class:is-selected={isSelected}>
				<div class="sv-wd-text-container">
					<div class="sv-wd-text">
						{item.text}
					</div>
					<div class="sv-wd-source">
						Source: {item.source.length > 1 ? item.source[0] : item.source}
					</div>
				</div>
			</div>
		{:else if item.$isGroupHeader}
			<div class="sv-wd-groupheader">
				<Icon
					name={icon}
					color="gray-600"
					position="m"
					size={16}
				/>
				<div class="sv-wd-groupheader-text">
					{item.label}
				</div>
			</div>
		{/if}
	</div>
{:else if isSelected}
	<div class="sv-wd-selected">
		<Icon
			name={item.type[0]}
			color="gray-600"
			position="m"
			size={16}
		/>
	</div>
{/if}

<style lang="scss">
	@use "../../style/global" as *;
	:global(.sv-dd-item) {
		.sv-wd-item {
			@include flex(row, flex-start, center);
			width: 100%;
			padding: 0.25rem;
			box-sizing: border-box;
			cursor: pointer;
			border-radius: $border-radius;
			&.sv-wd-item-header {
				cursor: default;
				background-color: var(--bg-tertiary) !important;
				margin: 0 !important;
				width: calc(100% + 1rem) !important;
				border-radius: 0;
			}

			.sv-wd-groupheader {
				@include flex(row, flex-start, center);
				@include ui-text(var(--text-secondary), 0.875rem, 500);
				padding: $p6;
				width: 100%;
				box-sizing: border-box;
				column-gap: $p6;

			}
			

			.sv-wd-item-content {
				width: 100%;
				border-radius: $border-radius;
				padding: 0.5rem;
				box-sizing: border-box;
				@include flex(row, flex-start, flex-start);

				.sv-wd-text-container {
					@include flex(column, flex-start, flex-start);
					width: 100%;
					box-sizing: border-box;

					.sv-wd-text {
						@include ui-text(var(--text-secondary), $p14, 400);
						margin: 0 0 0.25rem 0;
						padding: 0;
						text-overflow: ellipsis;
						width: 100%;
						overflow: hidden;
					}

					.sv-wd-source {
						@include ui-text(var(--text-tertiary), $p10, 400);
						@include flex(row, flex-end, center);
						margin: 0;
						padding: 0;
						;
						width: 100%;
					}
				}
			}
		}
		
	}
	:global(.sv-dd-item-active) {
		.sv-wd-item {
			background-color: var(--bg-tertiary) !important;
		}
	}
	:global(.sv-wd-selected) {
				padding: 0.5rem 0 0.5rem 0.5rem !important;

			}
</style>
