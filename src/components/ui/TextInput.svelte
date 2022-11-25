<script lang="ts">
	import Icon from "./Icon.svelte";
	import Button from "./Button.svelte";


	import { createEventDispatcher } from "svelte";

	export let placeholder: string = "";
	export let icon: Icons | null = null;
	export let option: NotionProp = null;
	export let type: string;
	export let clearable: boolean = true;
	export let useWebdata: boolean = false;
	export let savedValue: string;
	export let savedInput: InputItem;
	export let value: string;

	const dispatch = createEventDispatcher();

	let focused: boolean = false;
	let invalid: boolean = false;

	let inputEl;


	const handleFocus = (focus) => {
		if (focus) {
			dispatch("focus");
		} else {
			dispatch("blur");
		}
	};
</script>

<div
	class="text-input"
	class:invalid
	class:focused
	class:clearable
	on:click={() => (focused = true)}
>
	{#if icon}
		<div class="input-icon">
			<Icon
				{icon}
				color="inherit"
				size={20}
			/>
		</div>
	{/if}
	<div
		name={option ? option.id : "null"}
		class="input-box"
		wrap="soft"
		{placeholder}
		on:focus={() => (focused = true)}
		on:blur={() => (focused = false)}
		contenteditable
		bind:textContent={value}
		bind:this={inputEl}
	/>
	{#if value && clearable}
		<div class="clear-button">
			<Button
				icon="close"
				size="sm"
				color="red"
				style="minimal"
				on:click={(e) => {
					e.stopPropagation();
					value = null;
					inputEl.blur();
					focused = false;
				}}
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
		min-height: 42px;
		background: var(--bg-secondary);
		border: 1px solid var(--border-color-secondary);
		border-radius: $border-radius;
		transition: $transition;
		overflow: hidden;
		padding: $p6 $p6 0 $p12;
		box-shadow: var(--input-shadow-light);
		color: var(--text-secondary);

		.input-icon {
			@include flex(row, center, center);
			margin-right: $p8;
			padding-bottom: $p6;
		}
		.clear-button {
			@include flex(row, center, center);
			opacity: 0;
			transition: $transition;
			align-self: flex-start;
			margin: 0 $p6;
			height: $p28;
		}

		&.invalid {
			box-shadow: 0 0 0 3px var(--yellow-300);
			border: $border-color var(--yellow-500);
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
			padding: 1px 0 $p8 0;
			box-sizing: border-box;
			width: 100%;
		}
		.placeholder {
			@include flex(row, flex-start, center);
			@include ui-text(var(--text-secondary), $p14, 400);
			height: $p28;
			padding: 0 $p8 $p6 $p8;
			box-sizing: border-box;
			position: absolute;
			pointer-events: none;
			&.icon {
				padding: 0 $p6 $p6 $p24;
			}
		}
		&:hover {
			border: $border-color var(--blue);
			box-shadow: var(--input-shadow-light-hover);
			.clear-button {
				opacity: 1;
			}
		}
		&.focused {
			box-shadow: var(--input-shadow-light-hover);
			border: $border-color var(--blue);
			.clear-button {
				opacity: 1;
			}
		}
		&.invert {
			background-color: var(--bg);
			box-shadow: 0 0 $p6 $p3 var(--gray-200);
			&:hover {
				box-shadow: 0 0 0 3px var(--blue-100), 0 0 $p6 $p3 var(--gray-100);
			}
			&.focused {
				box-shadow: 0 0 0 3px var(--blue-100), 0 0 $p6 $p3 var(--gray-100);
			}
			&.invalid {
				box-shadow: 0 0 0 3px var(--yellow-100), 0 0 $p6 1px var(--gray-100);
			}
		}
	}
</style>
