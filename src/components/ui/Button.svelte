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
	export let color: CaptionColors = "blue";
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
	--btn-color: var(--{color});
	--btn-color-light: var(--{color}-light);
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
					{icon}
					color="inherit"
					size={size === "sm" ? 16 : size === "md" ? 16 : 16}
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
		border-radius: $border-radius;
		.button {
			@include flex(row, center, center);
			border-radius: var(--border-radius);
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
				height: $p24;
				font-size: 0.875rem;
				border-radius: $p3;
			}
			&.md {
				padding: 0rem 0.5rem;
				height: $p32;
				font-size: 0.875rem;
			}
			&.lg {
				padding: $p12 $p20;
				font-size: 0.875rem;
				box-sizing: border-box;
				.button-icon {
					margin-right: $p3;
				}
			}
			&.primary {
				background-color: var(--btn-color);
				color: var(--white-alpha-900);
				box-shadow: 0 0 1px 0 var(--btn-color-light);
				&:hover {
					filter: brightness(1.07);
					box-shadow: 0 0 0 3px var(--btn-color-light);
				}
				&.pressed {
					filter: brightness(0.96);
					box-shadow: 0 0 0 1px var(--btn-color-light);
				}
			}
			&.secondary {
				background-color: var(--btn-color-light);
				color: var(--text-alpha);
				&:hover {
					filter: brightness(1.04);
				}
			}
			&.outline {
				background-color: transparent;
				color: var(--btn-color);
				border: 1px solid var(--btn-color);
				&:hover {
					background-color: var(--btn-color-light);
				}
			}
			&.outline-fill {
				background-color: var(--btn-color-light);
				color: var(--btn-color);
				border: 1px solid var(--btn-color);
				&:hover {
					background-color: var(--btn-color);
					color: var(--white-alpha-900);
					border: $border-color var(--btn-color);
					box-shadow: 0 0 0 3px var(--btn-color-light);
				}
			}
			&.minimal {
				background-color: transparent;
				color: var(--text-secondary);
				&:hover {
					color: var(--btn-color);
					background-color: var(--btn-color-light);
				}
			}
			&.disabled {
				opacity: 0.5;
				cursor: not-allowed;
				pointer-events: none;
				&:hover {
					box-shadow: none;
				}
			}
		}
		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
			pointer-events: none;
			&:hover {
				box-shadow: none;
			}
		}
	}

	.fill {
		width: 100%;
	}
</style>
