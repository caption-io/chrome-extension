<script lang="ts">
	import Icon from "../ui/Icon.svelte";

	import { clickOutside } from "src/scripts/platform/ui-utils";

	import { slide } from "svelte/transition";

	export let propValue = "This is a prop value";
	export let propInput = null;
	export let multiple = false;

	let option: "never" | "input" | "value" = "never";
	let pendingChanges = false;

	let open = false;

	console.log(propValue, propInput);
</script>

<div
	class="save-button-container"
	use:clickOutside
	on:outclick={() => (open = false)}
>
	<div
		class="save-button"
		class:open
		on:click={() => (open = !open)}
	>
		<Icon
			icon="save"
			color="blue"
			size={12}
		/>
		<div
			class="arrow-icon"
			class:open
		>
			<Icon
				icon="chevronRight"
				color="blue"
				size={12}
			/>
		</div>
		{#if pendingChanges}
			<div class="pending-dot" />
		{/if}
	</div>
	{#if open}
		<div
			class="save-button-menu"
			transition:slide={{ duration: 200 }}
		>
			<div
				class="save-button-menu-item"
				on:click={() => {
					option = "never";
					open = false;
				}}
			>
				<Icon
					icon="close"
					color="blue"
					size={12}
				/>
				<div class="save-button-menu-item-text">Never auto-fill</div>
				<div
					class="radio"
					class:active={option === "never"}
				/>
			</div>
			<div
				class="save-button-menu-item"
				on:click={() => {
					if (!propValue) return;
					option = "value";
					open = false;
				}}
			>
				<Icon
					icon="rename"
					color="blue"
					size={12}
				/>
				<div class="save-button-menu-item-text">
					{#if propValue}
						Always use this value
					{:else}
						No value entered
					{/if}
				</div>
				<div
					class="radio"
					class:active={option === "value"}
				/>
			</div>
			<div
				class="save-button-menu-item disabled"
				on:click={() => {
					if (!propInput) return;
					option = "input";
					open = false;
				}}
			>
				<Icon
					icon="web"
					color="blue"
					size={12}
				/>
				<div class="save-button-menu-item-text">
					{#if propInput}
						Always use the data type
					{:else}
						No data type selected
					{/if}
				</div>
				<div
					class="radio"
					class:active={option === "input"}
				/>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	.save-button-container {
		position: relative;
		z-index: 10;
		.save-button {
			@include flex(row, center, center);
			padding: 0 $p6;
			border-radius: $p4;
			border: 1px solid var(--blue);
			background-color: var(--blue-light);
			transition: $transition;
			cursor: pointer;
			height: $p24;
			box-sizing: border-box;
			z-index: 0;
			position: relative;
			&:not(.open):hover {
				filter: brightness(1.05);
			}
			&.open {
				border-radius: $p4 $p4 0 0;
				border-bottom: 0px solid transparent;
				padding-bottom: 1px;
			}
			.arrow-icon {
				transition: $transition;
				&.open {
					transform: rotate(90deg);
				}
			}
			.pending-dot {
				position: absolute;
				top: -3px;
				right: -3px;
				width: $p6;
				height: $p6;
				border-radius: 50%;
				background-color: var(--red);
			}
		}
		.save-button-menu {
			position: absolute;
			top: 23px;
			right: 0;
			border-radius: $p4 0 $p4 $p4;
			border: 1px solid var(--blue);
			background-color: var(--blue-light);
			box-sizing: border-box;
			z-index: -1;
			width: max-content;
			box-shadow: 0 2px 8px 0 var(--shadow-color);
			.save-button-menu-item {
				@include flex(row, flex-start, center);
				padding: $p6 $p6;
				width: 100%;
				box-sizing: border-box;
				background-color: var(--blue-light);
				border-radius: $p4;
				cursor: pointer;
				&:hover {
					background-color: var(--white-alpha-600);
				}
				.save-button-menu-item-text {
					@include ui-text(var(--blue), $p12, 400);
					margin-left: $p3;
					padding-right: $p12;
				}
				.radio {
					width: $p12;
					height: $p12;
					border-radius: 6px;
					border: 1px solid var(--blue);
					justify-self: flex-end;
					box-sizing: border-box;
					margin-left: auto;
					transition: $transition;
					&.active {
						background-color: var(--blue);
						box-shadow: 0 0 0 2px var(--blue-light) inset;
					}
				}
				&.disabled {
					opacity: 0.5;
					cursor: default;
					pointer-events: none;
					&:hover {
						background-color: var(--blue-light);
					}
				}
			}
		}
	}
</style>
