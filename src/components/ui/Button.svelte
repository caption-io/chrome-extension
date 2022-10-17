<script lang="ts">
	import { each, missing_component } from "svelte/internal";
	import Icon from "./Icon.svelte";
	// exported props
	export let text: string = null;
	export let icon: Icons = null;
	export let iconPosition: "left" | "right" = "left";
	export let size: "sm" | "md" | "lg" = "md";
	export let style:
		| "primary"
		| "secondary"
		| "outline"
		| "outline-fill"
		| "minimal" = "primary";
	export let color: string = "blue";
	export let fill: boolean = false;
	export let disabled: boolean = false;

	let pressed: boolean = false;

	function mouseUp(e) {
		e.classList.add("mouse-up");
		setTimeout(() => {
			e.classList.remove("mouse-up");
			pressed = false;
		}, 300);
	}
</script>

<div
	class="button-container {style} {size}"
	class:disabled
	class:fill
	style="
	--btn-color-50: var(--{color}-50);
	--btn-color-100: var(--{color}-100);
	--btn-color-200: var(--{color}-200);
	--btn-color-300: var(--{color}-300);
	--btn-color-400: var(--{color}-400);
	--btn-color-500: var(--{color}-500);
	--btn-color-600: var(--{color}-600);
	--btn-color-700: var(--{color}-700);
	--btn-color-800: var(--{color}-800);
	--btn-color-900: var(--{color}-900);
	"
	on:click
>
	<div
		class="button {size} {style}"
		class:fill
		class:disabled
		class:icon
		class:pressed
		on:mousedown={() => (pressed = true)}
		on:mouseup={() => (pressed = false)}
	>
		{#if text}
			<div class="button-text">{text}</div>
		{/if}
		{#if icon}
			<div
				class="button-icon"
				style="order: {iconPosition === 'left' ? '0' : '2'}"
			>
				<Icon
					name={icon}
					color="inherit"
					size={size === "sm" ? 16 : size === "md" ? 16 : 20}
					position="m"
				/>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	@use "../../style/global" as *;

	@mixin mouseUp($shadcolor) {
		@keyframes mouseUp {
			0% {
				box-shadow: 0 0 0 1px $shadcolor;
			}
			70% {
				box-shadow: 0 0 0 4px $shadcolor;
			}
			100% {
				box-shadow: 0 0 0 3px $shadcolor;
			}
		}
	}

	.button-container {
		@include flex(row, center, center);
		border-radius: var(--border-radius);
		.button {
			@include flex(row, center, center);
			border-radius: $p3;
			column-gap: 0.25rem;
			cursor: pointer;
			border: 1px solid transparent;
			box-sizing: border-box;
			transition: 200ms ease;
			font-weight: 500;
			.button-text {
				order: 1;
			}
			&.sm {
				padding: 0 $p2;
				height: 1.5rem;
				font-size: 0.875rem;
			}
			&.md {
				padding: 0rem 0.5rem;
				height: 2rem;
				font-size: 0.875rem;
			}
			&.lg {
				padding: 0rem 0.75rem;
				height: 2.5rem;
				font-size: 1rem;
			}
			&.primary {
				background-color: var(--btn-color-400);
				color: var(--white-alpha-900);
				box-shadow: 0 0 1px 0 var(--btn-color-100);
				&:hover {
					background-color: var(--btn-color-300);
					box-shadow: 0 0 0 3px var(--btn-color-100);
				}
				&.pressed {
					background-color: var(--btn-color-500);
					box-shadow: 0 0 0 1px var(--btn-color-200);
				}
			}
			&.secondary {
				background-color: var(--btn-color-100);
				color: var(--btn-color-800);
				fill: var(--btn-color-800);
				&:hover {
					background-color: var(--btn-color-50);
				}
			}
			&.outline {
				background-color: transparent;
				color: var(--btn-color-200);
				fill: var(--btn-color-200);
				border: 1px solid var(--btn-color-200);
				&:hover {
					background-color: var(--btn-color-600);
				}
			}
			&.outline-fill {
				background-color: var(--btn-color-400);
				color: var(--btn-color-200);
				fill: var(--btn-color-200);
				border: 1px solid var(--btn-color-200);
				box-shadow: 0 0 1px 0 var(--btn-color-500);
				&:hover {
					background-color: var(--btn-color-400);
					box-shadow: 0 0 0 3px var(--btn-color-500);
				}
			}
			&.minimal {
				background-color: transparent;
				color: var(--gray-500);
				fill: var(--gray-500);
				&:hover {
					color: var(--btn-color-500);
					fill: var(--btn-color-500);
					background-color: var(--btn-color-50);
				}
			}
		}
	}

	.fill {
		width: 100%;
	}
</style>
