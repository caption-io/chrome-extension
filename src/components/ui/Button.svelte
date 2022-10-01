<script context="module" lang="ts">
	// import icons list
	import Icon from "./Icon.svelte";

	// prop types
	export type Value = string | null;
	export type Size = "small" | "med" | "big";
	export type IconPosition = "left" | "right";
	export type Disabled = boolean;
</script>

<script lang="ts">
	// exported props
	export let value: Value = null;
	export let size: Size = "med";
	export let style: ButtonStyles = "primary";
	export let color: AppColors = "blue";
	export let icon: Icons | null = null;
	export let iconPosition: IconPosition = "left";
	export let disabled: Disabled = false;

	// local variables
	let pressed = false;
	let cssClass;

	function clickAnim() {
		pressed = true;
		setTimeout(() => {
			pressed = false;
		}, 200);
	}

	// css class definitions
	$: cssClass = `button
		${" " + size}
		${" " + style}
		${" " + color}
		${pressed ? " click" : ""}
		${disabled ? "disabled" : ""}
		`;
</script>

<div
	class={`button-container${!value ? ` icon-only` : ""}${
		size === "small" ? " small" : ""
	}`}
>
	<button class={cssClass} on:click on:mousedown={clickAnim}>
		{#if value && icon && iconPosition === "left"}
			<Icon
				name={icon}
				size={size}
				color={style === "primary" ? "invert" : color}
				position={iconPosition}
				{disabled}
			/>
			{value}
		{/if}
		{#if !value && icon}
			<Icon name={icon} {size} {color} position={"center"} {disabled} />
		{/if}
		{#if value && !icon}
			{value}
		{/if}
		{#if value && icon && iconPosition === "right"}
			{value}
			<Icon name={icon} {size} {color} position={iconPosition} {disabled} />
		{/if}
	</button>
</div>

<style lang="scss">
	@use "../../style/global" as *;

	$button-styles: ("primary", "secondary", "outline", "simple", "disabled");
	$button-colors: ("grey", "blue", "red", "green", "bluegrey");

	$btn-sizes: (
		"small": (
			0.75rem,
			auto,
			0.5rem 0.5rem,
		),
		"med": (
			2rem,
			100%,
			0 1rem,
		),
		"big": (
			2.5rem,
			100%,
			inherit,
		),
	);

	@mixin btn-colors($col, $sty) {
		@if $sty == primary {
			background-color: var(--#{$col});
			color: var(--white);
			transition: filter 200ms, box-shadow 200ms;
			&:hover {
				box-shadow: 0 0 0 2px var(--#{$col}-mid);
				filter: brightness(1.05);
			}
			&.click {
				@include click(var(--#{$col}-mid), #{$col}-#{$sty});
			}
		}
		@if $sty == secondary {
			background-color: var(--#{$col}-light);
			color: var(--#{$col});
			font-weight: 500;
			&:hover {
				box-shadow: 0 0 0 2px var(--#{$col}-mid);
				filter: brightness(0.95);
			}
			&.click {
				@include click(var(--#{$col}-mid), #{$col}-#{$sty});
			}
		}
		@if $sty == outline {
			background-color: var(--trans);
			border: 1px solid var(--#{$col});
			color: var(--#{$col});
			&:hover {
				background-color: var(--trans);
				box-shadow: 0 0 0 2px var(--#{$col}-light);
			}
			&.click {
				@include click(var(--#{$col}-light), #{$col}-#{$sty});
			}
		}
		@if $sty == simple {
			background-color: var(--#{$col}-trans);
			color: var(--#{$col}-dark);
			font-weight: 600;
			transition: background 200ms, box-shadow 400ms;
			&:hover {
				background-color: var(--#{$col}-light);
				filter: brightness(0.95);
				box-shadow: 0 0 0 2px var(--#{$col}-mid);
			}
			&.click {
				@include click(var(--#{$col}), #{$col}-#{$sty});
			}
		}
		@if $sty == disabled {
			background-color: var(--#{$col}-light);
			color: var(--#{$col}-mid);
			filter: saturate(0.6);
			&:hover {
				cursor: not-allowed;
			}
		}
	}

	.button-container {
		@include flex(row, center, center);
		margin: 0;
		width: 100%;
		&.small {
			width: auto;
		}
		.button {
			@include flex(row, center, center);
			border: none;
			border-radius: 4px;
			background: none;
			transition: 150ms;
			cursor: pointer;
			white-space: nowrap;
			@each $size, $props in $btn-sizes {
				&.#{$size} {
					height: nth($props, 1);
					width: nth($props, 2);
					padding: nth($props, 3);
					box-sizing: border-box;
				}
			}

			@each $button-style in $button-styles {
				&.#{$button-style} {
					@each $button-color in $button-colors {
						&.#{$button-color} {
							@include btn-colors($button-color, $button-style);
						}
					}
				}
			}
		}
		&.icon-only {
			width: 2.25rem;
		}
	}
</style>
