<script lang="ts">
	import Icon from "./Icon.svelte";
	import { media } from "src/media";
  import { slide, crossfade } from "svelte/transition";

	export let options: RadioOptions[] = [];
	export let value;
	export let name: string = null;
	export let iconOnly: boolean = false;
	export let asColumn: boolean = false;

	const [send, receive] = crossfade({
		duration: d => Math.sqrt(d * 300)
	});
</script>

<div class="radio-container"
class:column={asColumn}
>
	{#each options as option}
		<label
			class="radio-label"
			class:active={option.id === value}
		>
			<input
				type="radio"
				{name}
				bind:group={value}
				value={option.id}
				on:change
			/>
			{#if option.image}
				{@html media[option.image]}
			{:else if option.icon}
				<Icon
					icon={option.icon}
					size={16}
					color="inherit"
				/>
			{/if}
			{#if !iconOnly}
				<span class="radio-name">{option.name}</span>
			{/if}
			{#if option.id === value}
				<div class="radio-indicator" in:receive={{key: "radio-indicator"}} out:send={{key: "radio-indicator"}} />
			{/if}
		</label>
	{/each}
</div>

<style lang="scss">
	@use "src/style/global" as *;
	:global(.radio-container svg) {
		width: 100%;
	}
	.radio-container {
		@include flex(row, flex-start, center);
		gap: $p4;
		padding: $p4;
		box-sizing: border-box;
		background-color: var(--bg-secondary);
		border-radius: var(--border-radius);
		box-shadow: var(--inset-shadow);
		width: 100%;
		
		input[type="radio"] {
			display: none;
		}
		.radio-indicator {
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: $p4;
			background-color: var(--bg);
			box-shadow: var(--input-shadow);
			z-index: -1;

		}
		.radio-label {
			@include flex(row, center, center);
			@include ui-text(var(--text-secondary), $p12, 500);
			position: relative;
			gap: $p3;
			padding: $p4 $p8;
			border-radius: $border-radius;
			flex-grow: 1;
			box-sizing: border-box;
			z-index: 0;
			&.active {
				color: var(--blue);
			}
			.radio-button {
				@include flex(row, center, center);
				gap: $p3;
				width: $p6;
				height: $p6;
				border-radius: 50%;
				border: 1px solid var(--gray-300);
				box-sizing: border-box;
				&:hover {
					border-color: var(--border-color);
				}
				&:active {
					border-color: var(--blue-alpha-200);
				}
				&:checked {
					background-color: var(--bg-teriary);
					border-color: var(--bg-teriary);
				}
			}
			.radio-image {
				width: $p6;
				height: $p6;
				border-radius: 50%;
				object-fit: cover;
			}
			.radio-name {
			}
		}
		&.column {
			@include flex(column, flex-start, flex-start);
			.radio-label {
				width: 100%;
			}
		}
	}
</style>
