<script lang="ts">
	import Icon from "./Icon.svelte";
	import Button from "./Button.svelte";

	import { clickOutside } from "src/scripts/ui-utils";

	import { createEventDispatcher } from "svelte";

	export let value: string = null;
	export let placeholder: string = "";
	export let icon: Icons | null = null;
	export let option: NotionProp = null;
	export let type: string;
	export let clearable: boolean = true;

	const dispatch = createEventDispatcher();

	let focused: boolean = false;
	let invalid: boolean = false;

	function handleFocus(value) {
		focused = value;
		if (focused) {
			dispatch("focus");
		} else {
			dispatch("blur");
		}
	}

</script>

<div
	class="text-input"
	class:invalid
	class:focused
	class:clearable
	use:clickOutside
	on:click={() => handleFocus(true)}
	on:outclick={() => handleFocus(false)}
>
	{#if icon}
		<div class="input-icon">
			<Icon
				name={icon}
				color="gray-500"
				size={20}
			/>
		</div>
	{/if}
	<div
		name={option ? option.id : "null"}
		class="input-box"
		wrap="soft"
		{placeholder}
		on:focus={() => handleFocus(true)}
		contenteditable
		bind:textContent={value}
	/>
	{#if value && clearable}
		<div class="clear-button">
			<Button
				icon="close"
				size="sm"
				color="red"
				style="minimal"
				on:click={() => (value = null)}
			/>
		</div>
	{/if}
	{#if !value && !focused}
		<span
			class="placeholder"
			class:icon>{placeholder}</span
		>
	{/if}
</div>

<style lang="scss">
	@use "../../style/global" as *;

	.text-input {
		@include flex(row, flex-start, center);
		box-sizing: border-box;
		width: 100%;
		background: var(--bg-tertiary);
		border: $border-color transparent;
		border-radius: $border-radius;
		transition: $transition;
		overflow: hidden;
		padding: $p8;

		.input-icon {
			@include flex(row, center, center);
			margin-right: $p8;
		}
		.clear-button {
			opacity: 0;
			transition: $transition;
		}

		&.invalid {
			box-shadow: 0 0 0 3px var(--yellow-light);
			border: $border-color var(--yellow);
		}

		.input-box {
			@include flex(row, flex-start, flex-start);
			@include ui-text(var(--text), $p14, 400);
			outline: none;
			border: none;
			background: transparent;
			min-height: $p24;
			line-height: 1.5;
			line-break: auto;
			word-break: break-word;
			overflow: hidden;
			padding: 1px 0 0 0;
			box-sizing: border-box;
			width: 100%;
		}
		.placeholder {
			@include flex(row, flex-start, center);
			@include ui-text(var(--gray-500), $p14, 400);
			height: $p28;
			padding: 0 $p8 0 $p8;
			box-sizing: border-box;
			position: absolute;
			pointer-events: none;
			&.icon {
				padding: 0 $p24;
			}
		}
		&:hover {
			background-color: var(--bg);
			box-shadow: 0 0 0 $p3 var(--blue-100);
			border: $border-color var(--blue-300);
			.clear-button {
				opacity: 1;
			}
		}
		&.focused {
			background-color: var(--bg);
			box-shadow: 0 0 0 $p3 var(--blue-100);
			border: $border-color var(--blue-300);
			.clear-button {
				opacity: 1;
			}
		}
	}
</style>
