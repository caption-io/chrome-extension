<script lang="ts">
	import { captionIcons } from "src/icons";
	export let icon: Icons = null;
	export let url: string = null;
	export let size: number = null;
	export let color: CaptionColors = null;
	export let alt: string = null;
	// id is svg file
	// get content of svg file
</script>

<div
	class="cpt-icon {color}"
	style="--icon-size: {size}px; --icon-color: {color === 'inherit'
		? 'currentColor'
		: `var(--${color}`});"
	class:notransition={color === "inherit"}
>
	{#if icon && !url}
		<svg
			class="svg"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			{@html captionIcons[icon]}
		</svg>
	{:else if url}
		<img
			class="url-icon"
			src={url}
			{alt}
		/>
	{:else}
		<svg
			class="svg"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			{@html captionIcons.doc}
		</svg>
	{/if}
</div>

<style lang="scss">
	@use "../../style/global" as *;
	:global {
		.cpt-icon {
			@include flex(row, center, center);
			color: var(--icon-color);
			width: var(--icon-size);
			height: var(--icon-size);
			transition: $transition;
			&.notransition {
				transition: none;
			}

			svg {
				height: 100%;
				width: 100%;
			}
			.url-icon {
				width: 100%;
				height: 100%;
				border-radius: $p8;
			}
		}
	}
</style>
