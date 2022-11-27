<script lang="ts">
	import Button from "../../ui/Button.svelte";
	import Icon from "../../ui/Icon.svelte";
	import SaveButton from "../SaveButton.svelte";

	import { createEventDispatcher } from "svelte";
	import { isBoolean } from "lodash-es";

	export let text: string;
	export let icon: Icons;
	export let hovered: boolean;
	export let visible: boolean;
	export let inputData: InputItem = null;
	export let propValue = null;
	export let pendingChanges;
	export let saveState;
	export let prop: FlowProp;

	export let showInputData;

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
		<div class="visible-button">
			<Button
				icon={visible ? "eye_close" : "eye_open"}
				size="sm"
				color="blue"
				style="minimal"
				on:click={() => dispatch("optionclick", "visible")}
			/>
		</div>
		<div
			class="input-data-button"
			on:click={() => dispatch("optionclick", "inputdata")}
			class:inputDataOpen={showInputData === prop.id}
		>
			<Icon
				icon="web"
				color="inherit"
				size={16}
			/>
		</div>
		<SaveButton
			propInput={inputData}
			{propValue}
			{saveState}
			bind:prop
			on:save
			bind:pendingChanges
			{hovered}
		/>
	</div>
</div>

<style lang="scss">
	@use "src/style/global" as *;
	:global() {
		.input-label {
			@include flex(row, flex-start, center);
			width: 100%;
			padding: $p6 0 $p3 0;
			box-sizing: border-box;
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
				// transition: $transition;
				.input-data-button {
					@include flex(row, center, center);
					border-radius: $p4;
					border: 1px solid transparent;
					transition: $transition;
					cursor: pointer;
					height: $p24;
					width: $p24;
					box-sizing: border-box;
					z-index: 0;
					position: relative;
					color: var(--text-secondary);
					opacity: 0;

					&:not(.open):hover {
						filter: brightness(1.05);
					}
					&.active {
						color: var(--blue);
						border: 1px solid var(--blue);
						background-color: var(--blue-light);
					}
				}
				.visible-button {
					opacity: 0;
					transition: $transition;
				}
			}
			&.hovered {
				.options {
					.input-data-button,
					.visible-button {
						opacity: 1;
					}
				}
			}
		}
	}
</style>
