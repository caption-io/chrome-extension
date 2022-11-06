<script lang="ts">
	import Button from "./Button.svelte";
	import Icon from "./Icon.svelte";
	import SaveButton from "../flows/SaveButton.svelte";
	import InputData from "../flows/InputData.svelte";

	import { createEventDispatcher } from "svelte";
	import { isBoolean } from "lodash-es";

	export let text: string;
	export let icon: Icons;
	export let hovered: boolean;
	export let visible: boolean;

	const dispatch = createEventDispatcher();
</script>

<div
	class="input-label"
	class:hovered
>
	<div class="label-text">
		{#if icon}
			<Icon
				{icon}
				size={14}
				color="gray"
			/>
		{/if}
		<p class="text">{text}</p>
	</div>
	<div class="options">
		<Button
			icon={visible ? "eye_close" : "eye_open"}
			size="sm"
			color="blue"
			style="minimal"
			on:click={() => dispatch("optionclick", "visible")}
		/>
		<div
			class="input-data-button"
			on:click={() => dispatch("optionclick", "inputdata")}
		>
			<Icon
				icon="web"
				color="blue"
				size={12}
			/>
		</div>
		<SaveButton />
	</div>
</div>

<style lang="scss">
	@use "src/style/global" as *;
	.input-label {
		@include flex(row, flex-start, center);
		width: 100%;
		padding: $p6 0 $p3 0;
		box-sizing: border-box;
		border-bottom: $border-light;
		.label-text {
			@include flex(row, flex-start, center);
			margin: 0 0 0 $p3;
			width: 100%;
			cursor: grab;
			.text {
				@include ui-text(var(--text-secondary), $p12, 500);
				display: block;
				flex-grow: 1;
				margin: 0 0 0 $p6;
			}
		}
		.options {
			@include flex(row, center, center);
			column-gap: $p6;
			justify-self: flex-end;
			opacity: 0;
			transition: $transition;
			.input-data-button {
				@include flex(row, center, center);
				padding: 0 $p6;
				border-radius: $p4;
				border: 1px solid var(--blue);
				background-color: var(--blue-light);
				transition: $transition;
				cursor: pointer;
				height: $p24;
				box-sizing: border-box;
				z-index: 0;
				position: relative;
				&:not(.open):hover {
					filter: brightness(1.05);
				}
			}
		}
		&.hovered {
			.options {
				opacity: 1;
			}
		}
	}
</style>
