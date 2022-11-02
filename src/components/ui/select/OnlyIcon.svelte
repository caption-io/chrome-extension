<script lang="ts">
	import { itemActions } from "svelecte/item";
	import Icon from "../Icon.svelte";

	export let inputValue;
	export let index = -1;
	export let item = null;
	export let isSelected;
	export let isDisabled = false;
	export let isMultiple = false;
	let iconUrl = !item.icon
		? "none"
		: item.icon.startsWith("http")
		? "external"
		: "internal";
</script>

<div
	class="sv-item sv-io-item"
	class:isSelected
	class:isMultiple
	use:itemActions={{ item, index }}
	on:select
	on:deselect
	on:hover
>
	{#if (iconUrl = "external")}
			<img
				src={item.icon}
				alt={item.name}
				class="icon"
			/>
	{:else if (iconUrl = "internal")}
		<div class="icon">
			<Icon name={item.icon} />
		</div>
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	:global {
		.sv-io {
			.sv-control {
				width: fit-content !important;
				.sv-io-item {
					.icon {
						height: $p16;
						width: $p16;
						margin: $p2 $p6 0 $p6;
						border-radius: 100%;
					}
				}
				.inputBox {
					width: 0 !important;
					padding: 0 !important;
					margin:  0 !important;
				}
			}
		}
	}
</style>