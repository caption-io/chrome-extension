<script lang="ts">
	import { icons } from "../../icons";
	// exported props
	export let name: Icons = null;
	export let url: string | (() => string)= null;
	export let size: number = 16;
	export let color: string | "inherit" = "gray-400";
	export let position: "l" | "r" | "m" = "m";
</script>

<div
	class="icon {color} {position} {size}"
	style="--icon-color: var(--{color});--icon-size: {size}px;"
	on:click
>
	{#if name && !url}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="icon-svg"
			viewBox="0 0 24 24"
		>
			{@html icons[name]}
		</svg>
	{:else if url}
		<img
			class="url-icon"
			src={url}
			alt=""
		/>
	{/if}
</div>

<style lang="scss">
	@use "../../style/global" as *;
	.icon {
		@include flex(row, center, center);
		fill: var(--icon-color);
		color: var(--icon-color);
		width: var(--icon-size);
		height: var(--icon-size);
		&.l {
			margin: 0px 4px 0 0;
		}
		&.r {
			margin: 1px 0 0 4px;
		}
		&.c {
			margin: 0 0 0 0;
		}
		.url-icon {
			width: 100%;
			height: 100%;
		}
	}
</style>
