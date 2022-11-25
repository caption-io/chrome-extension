<script lang="ts">
	import Icon from "../ui/Icon.svelte";

	import { clickOutside } from "src/scripts/platform/ui-utils";

	import { slide } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	export let propValue;
	export let propInput = null;
	export let multiple = false;
	export let pendingChanges;
	export let saveState;
	export let option: "never" | "input" | "value" = saveState
		? saveState
		: "never";
	export let prop: FlowProp;
	export let hovered;

	const dispatch = createEventDispatcher();

	let open = false;
</script>

<div
	class="save-button-container"
	use:clickOutside
	on:outclick={() => (open = false)}
>
	<div
		class="save-button"
		class:open
		class:hovered
		class:pending={pendingChanges.value}
		on:click={() => (open = !open)}
	>
		<Icon
			icon="save"
			color="gray"
			size={16}
		/>
		{#if pendingChanges.value}
			<div class="pending-dot" />
		{/if}
	</div>
	{#if open}
		<div
			class="save-button-menu"
			transition:slide={{ duration: 200 }}
		>
			<div class="save-button-menu-item current">
				<div class="save-button-menu-item-text">
					<div class="menu-item-label">
						<Icon
							icon="save"
							color="inherit"
							size={12}
						/>
						Currently {prop.savedInput
							? "using input:"
							: prop.savedValue
							? "using value:"
							: "not auto-filling."}
					</div>
					{#if prop.savedInput}
						<div class="menu-item-value">
							<span class="provider-text">{prop.savedInput.inputItemGroup.label}</span
							>{" - " + prop.savedInput.inputItemProvider.name}
						</div>
					{:else if prop.savedValue}
						<div class="menu-item-value">
							{prop.savedValue}
						</div>
					{/if}
				</div>
			</div>
			<div
				class="save-button-menu-item"
				on:click={() => {
					option = "never";
					open = false;
					dispatch("save", "never");
				}}
			>
				<div class="save-button-menu-item-text">
					<div class="menu-item-label">
						<Icon
							icon="close"
							color="inherit"
							size={12}
						/>
						Never auto-fill
					</div>
				</div>
			</div>
			<div
				class="save-button-menu-item {propValue ? '' : 'disabled'}"
				on:click={() => {
					if (!propValue) return;
					option = "value";
					open = false;
					dispatch("save", "value");
				}}
			>
				<div class="save-button-menu-item-text">
					{#if propValue}
						<div class="menu-item-label">
							<Icon
								icon="rename"
								color="inherit"
								size={12}
							/>
							Always use this value
						</div>
						<div class="menu-item-value">
							{propValue}
						</div>
					{:else}
						No value entered
					{/if}
				</div>
			</div>
			<div
				class="save-button-menu-item {propInput ? '' : 'disabled'}"
				on:click={() => {
					if (!propInput) return;
					option = "input";
					open = false;
					dispatch("save", "input");
				}}
			>
				<div class="save-button-menu-item-text">
					{#if propInput}
						<div class="menu-item-label">
							<Icon
								icon="web"
								color="inherit"
								size={12}
							/>
							Always use the data type
						</div>
						<div class="menu-item-value">
							<span class="provider-text">{propInput.inputItemGroup.label}</span
							>{" - " + propInput.inputItemProvider.name}
						</div>
					{:else}
						No data type selected
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	.save-button-container {
		z-index: 10;
		.save-button {
			@include flex(row, center, center);
			padding: 0 $p6;
			border-radius: $p4;
			border: 1px solid transparent;
			transition: $transition;
			cursor: pointer;
			height: $p24;
			box-sizing: border-box;
			z-index: 0;
			position: relative;
			opacity: 0;
			&:not(.open):hover {
				filter: brightness(1.05);
			}
			&.open {
				border-radius: $p4 $p4 0 0;
				border-top: 1px solid var(--border-color-secondary);
				border-left: 1px solid var(--border-color-secondary);
				border-right: 1px solid var(--border-color-secondary);
				border-bottom: 0px solid transparent;
				background-color: var(--bg);
				padding-bottom: 1px;
				opacity: 1;
			}
			&.hovered, &.pending {
				opacity: 1;
			}
			.pending-dot {
				position: absolute;
				top: 0;
				right: 0;
				width: $p6;
				height: $p6;
				border-radius: 50%;
				background-color: var(--red);
			}
		}
		.save-button-menu {
			position: absolute;
			top: 29px;
			right: 0;
			border-radius: $p4 0 $p4 $p4;
			border: 1px solid var(--border-color-secondary);
			background-color: var(--bg-quaternary);
			box-sizing: border-box;
			z-index: -1;
			width: 100%;
			box-shadow: var(--input-shadow-heavy);
			.save-button-menu-item {
				@include flex(row, flex-start, center);
				padding: $p8;
				width: calc(100% - 8px);
				box-sizing: border-box;
				border-radius: $p4;
				cursor: pointer;
				@include ui-text(var(--text), $p12, 400);
				margin: 0 $p4;
				&:hover {
					background-color: var(--bg-secondary);
				}
				.save-button-menu-item-text {
					margin-left: $p3;
					padding-right: $p12;
					.menu-item-value {
						@include ui-text(var(--text-secondary), $p12, 400);
						margin-top: $p3;
						margin-left: $p18;
						max-width: 300px;
						.provider-text {
							font-weight: 500;
						}
					}
					.menu-item-label {
						@include flex(row, flex-start, center);
						gap: $p6;
					}
				}
				.radio {
					width: $p12;
					height: $p12;
					border-radius: 6px;
					border: 1px solid var(--border-color);
					justify-self: flex-end;
					box-sizing: border-box;
					margin-left: auto;
					transition: $transition;
					&.active {
						background-color: var(--text);
						box-shadow: 0 0 0 2px var(--text-secondary) inset;
					}
				}
				&.disabled {
					cursor: default;
					pointer-events: none;
					color: var(--text-secondary);
					&:hover {
						background-color: var(--blue-light);
					}
				}
				&.current {
					background-color: var(--bg);
					color: var(--text-secondary);
					border-radius: $p4 0 0 0;
					margin: 0 0 $p6 0;
					width: 100%;
					box-shadow: var(--input-shadow-light);
					cursor: default;
					.menu-item-value {
						color: var(--text);
					}
					&:hover {
						background-color: var(--bg);
					}
				}
			}
		}
	}
</style>
