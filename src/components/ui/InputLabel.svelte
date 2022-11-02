<script lang="ts">
	import Button from "./Button.svelte";
	import Icon from "./Icon.svelte";
	import SaveButton from "../flows/SaveButton.svelte";

	import {createEventDispatcher} from "svelte";

	export let text: string;
	export let icon: Icons;
	export let hovered: boolean;
	export let visible: boolean;

	const dispatch = createEventDispatcher();
</script>

<div class="input-label">
	<div class="label-text">
		{#if icon}
			<Icon
				icon={icon}
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
		<Button
			icon="web"
			size="sm"
			color="blue"
			style="minimal"
			on:click={() => dispatch("optionclick", "input")}
		/>
		<Button
			icon="sliders"
			size="sm"
			color="blue"
			style="minimal"
			on:click={() => dispatch("optionclick", "settings")}
		/>
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
			transition: $transition	;
		}
		&:hover {
			.options {
				opacity: 1;
			}
		}
	}
</style>
