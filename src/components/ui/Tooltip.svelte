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
	export let location: { x: number; y: number };
	export let delay: number = 0;

	delay = delay == null || delay === undefined ? 400 : delay;
	
	
	let setHorOffset: string = position.includes("left") ? `left: ${location.x - 24}px` : position.includes("right") ? `right: ${window.innerWidth - location.x - 24}px` : `left: ${location.x -24}px`;
	console.log("Tooltip: ", show, value, position, location, delay, setHorOffset);
</script>

<div class={`tooltip ${position} ${show ? "show" : "hide"}`}
transition:fade={{ duration: 200, delay: delay }}
style:top={location.y + "px"}
style={setHorOffset}
>
		{#if show}
			<div class={`tooltip-carrot ${position}`} />
			<div class="tooltip-text">{value}</div>
		{/if}
</div>

<style lang="scss">
	@use "../../style/global" as *;
.tooltip {
	position: absolute;
	pointer-events: none;
	max-width: 250px;
	border-radius: var(--border-radius);
	box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.07), 0 0 0 1px var(--blue);
	z-index: 14000;
	background-color: var(--blue-light);
		&.hide {
			display: none;
		}
		
		.tooltip-carrot {
			// carrot with a background of var(--bg) and a border of var(--border-color)

			position: absolute;
			width: 0.75rem;
			height: 0.75rem;
			transform: rotate(45deg);
			background: var(--blue-light);
			box-shadow: 1px 1px 0 0 var(--blue);
			pointer-events: none;
			&.top-left {
				bottom: -0.375rem;
				left: 1rem;
				transform: translate(-50%) rotate(45deg);
			}
			&.top-center {
				bottom: -0.375rem;
				right: calc(50% - 0.75rem);
				transform: translate(-50%) rotate(45deg);
			}
			&.top-right {
				bottom: -0.375rem;
				right: 0.5rem;
				transform: translate(-50%) rotate(45deg);
			}
			&.right {
				top: calc(50% - 0.375rem);
				left: 0;
				transform: translate(-50%) rotate(135deg);
			}
			&.bottom-right {
				top: -0.375rem;
				right: 0.5rem;
				transform: translate(-50%) rotate(-135deg);
			}
			&.bottom-center {
				top: -0.375rem;
				right: calc(50% - 0.75rem);
				transform: translate(-50%) rotate(-135deg);
			}
			&.bottom-left {
				top: -0.375rem;
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
			@include ui-text(var(--blue), $p12, 500);
			padding: $p6 $p8;
			border-radius: var(--border-radius);
			box-sizing: border-box;
			z-index: 14002;
			pointer-events: none;
		}
	}

</style>
