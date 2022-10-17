<script lang="ts">
	import { itemActions, CloseButton } from "svelecte/item";
	import Icon from "src/components/ui/Icon.svelte";
	import { xlink_attr } from "svelte/internal";

	export let inputValue;
	export let index = -1;
	export let item: NotionSelectOption | NotionDatabase = null;
	export let isSelected;
	export let isDisabled = false;
	export let isMultiple = false;

	function highlightSearch(text, seachInput) {
		if (seachInput) {
			const regex = new RegExp(seachInput, "gi");
			const matches = text.match(regex);
			if (matches) {
				const highlighted = matches.map((match) => {
					return `<span class="highlight">${match}</span>`;
				});
				return text.replace(regex, highlighted);
			}
		}
		return text;
	}

	let higlighted;

	$: if (inputValue) {
		higlighted = highlightSearch(item.name, inputValue);
	} else {
		higlighted = `<span>${item.name}</span>`;
	}

	function isSelectOption(
		option: NotionSelectOption | NotionDatabase
	): option is NotionSelectOption {
		return (option as NotionSelectOption).color !== undefined;
	}
	function isDatabase(
		option: NotionSelectOption | NotionDatabase
	): option is NotionDatabase {
		return (option as NotionDatabase).icon !== undefined;
	}

	console.log("isSelectOption", isSelectOption(item));
</script>

{#if item.name}
	<div
		class="sv-item"
		class:isSelected
		class:isMultiple
		use:itemActions={{ item, index }}
		on:select
		on:deselect
		on:hover
		style={isSelectOption(item)
			? `--ns-text-color: var(--${item.color}-800); 
		--ns-bg-color: var(--${item.color}-100);
		--ns-close-color: var(--${item.color}-50);`
			: "--ns-text-color: var(--gray-700); --ns-bg-color: none; --ns-close-color: var(--gray-50);"}
	>
		<div class="sv-item-content sv-ns-item" >
			{#if isDatabase(item)}
				{#if !item.icon}
					<Icon
						name="doc"
						color="gray-600"
						position="l"
						size={16}
					/>
				{:else}
					<Icon
						url={item.icon}
						color="gray-600"
						position="l"
						size={16}
					/>
				{/if}
			{/if}
			{@html higlighted}
			{#if isSelected && isMultiple && isSelectOption(item)}
				<div
					class="close-button"
					data-action="deselect"
				>
					<Icon
						name="close"
						color="{item.color}-800"
						position="m"
						size={16}
					/>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	@use "src/style/global" as *;

	:global {
		.sv-notion-select {
			.sv-ns-item {
				@include flex(row, flex-start, center);
				height: $p24;
				padding: 0 $p6;
				@include ui-text(var(--ns-text-color), $p14, 400);
				background-color: var(--ns-bg-color);
				border-radius: $border-radius-small !important;
				width: fit-content;
				box-sizing: border-box;
				.close-button {
					border-radius: $border-radius-small;
					cursor: pointer;
					&:hover {
						background-color: var(--ns-close-color);
					}
				}
				.highlight {
					background-color: var(--blue-200);
					border-radius: $border-radius-small;
					font-weight: 600;
				}
			}
			.sv-control {
				border: $border-dark;
				.sv-content {
					gap: $p6;
					padding: $p8 $p6 $p6 $p6 !important;
				}
			}
			.sv-dropdown {
				background-color: var(--bg) !important;
				.sv-dropdown-scroll {
					padding: $p6 0 !important;
					.sv-dropdown-content {
						@include flex(column, flex-start, flex-start);
						.sv-dd-item {
							width: 100%;
							padding: $p3 $p6;
							cursor: pointer;
							&:hover {
								background-color: var(--bg-secondary);
							}

							.sv-item {
								@include flex(row, flex-start, center);
								border-radius: $border-radius-small !important;
								overflow: hidden;
							}
						}
					}
				}
			}
		}
	}
</style>
