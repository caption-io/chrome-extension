<script lang="ts">
	import { fade } from "svelte/transition";

	export let show: boolean = false;
	export let value: string = "";
	export let position:
		| "top-left"
		| "top-center"
		| "top-right"
		| "right"
		| "bottom-right"
		| "bottom-center"
		| "bottom-left"
		| "left" = "top-center";
</script>

<div
	class={`main ${position} ${show ? "show" : "hide"}`}
	transition:fade={{ duration: 200 }}
>
	{#if show}
		<div class={`tooltip-carrot ${position}`} />
		<div class="tooltip-text">{value}</div>
	{/if}
</div>

<style lang="scss">
	@use "../../style/global" as *;

	.main {
		position: absolute;
		box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.07), 0 0 0 1px var(--border-color);
		border-radius: var(--border-radius);
		z-index: 14000;
		&.hide {
			display: none;
		}
		&.top-left {
			top: -1.5rem;
			left: 0;
		}
		&.top-center {
			top: -1.5rem;
			left: 50%;
			transform: translateX(-50%);
		}
		&.top-right {
			top: -1.5rem;
			right: 0;
		}
		&.right {
			top: 50%;
			right: -1.5rem;
			transform: translateY(-50%);
		}
		&.bottom-right {
			bottom: -3.15rem;
			right: 0;
		}
		&.bottom-center {
			bottom: -3.15rem;
			left: 50%;
			transform: translateX(-50%);
		}
		&.bottom-left {
			bottom: -3.15rem;
			left: 0;
		}
		&.left {
			top: 50%;
			left: -1.5rem;
			transform: translateY(-50%);
		}
		.tooltip-carrot {
			// carrot with a background of var(--bg) and a border of var(--border-color)

			position: absolute;
			width: 0.75rem;
			height: 0.75rem;
			transform: rotate(45deg);
			background: var(--bg);
			box-shadow: 1px 1px 0 0 var(--border-color);
			&.top-left {
				bottom: -0.375rem;
				left: 1rem;
				transform: translate(-50%) rotate(45deg);
			}
			&.top-center {
				bottom: -.375rem;
				right: calc(50% - 0.75rem);
				transform: translate(-50%) rotate(45deg);

			}
			&.top-right {
				bottom: -.375rem;
				right: 0.5rem;
				transform: translate(-50%) rotate(45deg);
			}
			&.right {
				top: calc(50% - 0.375rem);
				left: 0;
				transform: translate(-50%) rotate(135deg);
			}
			&.bottom-right {
				top: -.375rem;
				right: 0.5rem;
				transform: translate(-50%) rotate(-135deg);
			}
			&.bottom-center {
				top: -.375rem;
				right: calc(50% - 0.75rem);
				transform: translate(-50%) rotate(-135deg);
			}
			&.bottom-left {
				top: -.375rem;
				left: 1rem;
				transform: translate(-50%) rotate(-135deg);
			}
			&.left {
				top: calc(50% - 0.375rem);
				right: -0.75rem;
				transform: translate(-50%) rotate(-45deg);
			}
			
		}
		.tooltip-text {
			@include flex(column, center, center);
			@include ui-text(var(--text-dark), 0.75, 500);
			height: 2rem;
			padding: 0 0.5rem;
			border-radius: 0.25rem;
			background: var(--bg);
			box-sizing: border-box;
			z-index: 14002;
		}
	}
</style>
