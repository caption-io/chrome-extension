<script lang="ts">
	import Icon from "./Icon.svelte";
	import { media } from "src/media";

	export let options: {
		name: string;
		id: string;
		image?: string;
		icon?: Icons;
	}[] = [];
	export let value;
	export let name: string = null;
</script>

<div class="radio-container">
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
					name={option.icon}
					size={16}
				/>
			{/if}
			<span class="radio-name">{option.name}</span>
		</label>
	{/each}
</div>

<style lang="scss">
	@use "src/style/global" as *;
	:global(.radio-container svg) {
		width: 100%;
	}
	.radio-container {
		@include flex(row, space-between, flex-start);
		width: 100%;
		gap: $p12;
		box-sizing: border-box;
		input[type="radio"] {
			display: none;
		}
		.radio-label {
			@include flex(column, center, center);
			padding: 0 $p3 $p4 $p3;
			border-radius: $border-radius;
			background-color: var(--bg-tertiary);
			&.active {
				background-color: var(--blue-alpha-300);
				@include ui-text(var(--blue-400), $p14, 500);
			}
			.radio-button {
				@include flex(row, center, center);
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
				@include ui-text(var(--text-secondary), $p12, 500);
			}
		}
	}
</style>
