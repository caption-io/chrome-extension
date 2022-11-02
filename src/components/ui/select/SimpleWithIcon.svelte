<script lang="ts">
	import { itemActions, CloseButton } from "svelecte/item";

	import Icon from "../Icon.svelte";

	export let inputValue;
	export let index = -1;
	export let item = null;
	export let isSelected;
	export let isDisabled = false;
	export let isMultiple = false;

	let higlighted;
	let iconUrl =
		!item.icon || item.icon === null
			? "none"
			: item.icon.startsWith("http")
			? "external"
			: "internal";


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

	$: if (inputValue) {
		higlighted = highlightSearch(item.name, inputValue);
	} else {
		higlighted = `<span>${item.name}</span>`;
	}
</script>

<div
	class="sv-item sv-si-item"
	class:isSelected
	class:isMultiple
	use:itemActions={{ item, index }}
	on:select
	on:deselect
	on:hover
>
	{#if iconUrl === "external"}
		<img
			src={item.icon}
			alt={item.name}
			class="icon"
			style={item.token ? "border-radius: 50%" : ""}
		/>
	{:else if iconUrl === "internal"}
		<div class="icon">
			<Icon
				icon={item.icon}
				size={16}
			/>
		</div>
	{:else if iconUrl === "none"}
		<div class="icon">
			<Icon
				icon="doc"
				size={16}
				color="gray"
			/>
		</div>
	{/if}
	<div class="sv-si-name">
		{item.name}
	</div>
	{#if isMultiple}
		<CloseButton />
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	:global {
		.sv-si {
			width: 100% !important;
			&.noposition {
				position: unset !important;
			}
			.sv-si-item {
				@include flex(row, flex-start, center);
				width: 100%;
				padding: $p8 $p6;
				border-radius: $border-radius-small;
				box-sizing: border-box;
				
				.sv-si-name {
					@include ui-text(var(--text-secondary), $p14, 500);
				}
				.icon,
				.sv-si-icon {
					height: $p16;
					width: $p16;
					margin-right: $p6;
				}
			}
			.sv-control {
			}
			.sv-dropdown {
				.sv-dd-item-active .sv-si-item {
					background-color: var(--bg-tertiary) !important;
				}
			}
			&.noicons {
				.icon {
					display: none;
				}
			}
		}
	}
</style>
