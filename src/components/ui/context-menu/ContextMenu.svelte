<script lang="ts">
	// IMPT: Packages
	import { fly, fade } from "svelte/transition";
	import { createEventDispatcher } from "svelte";

	// IMPT: Components
	import Icon from "../Icon.svelte";

	export let options: ContextMenuOptions[];

	// VARS: Local
	let hoverColor: AppColors = "red";

	// VARS: Utils
	const dispatch = createEventDispatcher();

	// FUNC: Event Handlers
	const dangerHover = (b: boolean) => {
		b ? (hoverColor = "invert") : (hoverColor = "red");
		console.log(b, hoverColor);
	};

	const handleClick = (option: string) => dispatch(option);
	// TODO: handle flow deletion
</script>

<div class="main" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
	{#each options as option}
		{#if option === "divider"}
			<div class="divider" />
		{:else}
			<div
				class={`menu-option ${option.style === 'danger' ? "danger" : ""}`}
				on:click={() => dispatch('message', {text: option.message})}
			>
				{#if option.icon}
					<Icon
						name={option.icon}
						size="med"
						color={option.style === "danger" ? "red" : "grey"}
						position="left"
						light={option.style === "danger" ? false : true}
					/>
				{/if}
				<div class="menu-option-text">{option.label}</div>
			</div>
		{/if}
	{/each}
</div>

<!-- <ContextMenuOption
		label="Favorite"
		message="favorite"
		icon="favorite"
		danger={false}
		on:message
	/>
	<ContextMenuOption
		label="Rename"
		message="rename"
		icon="rename"
		danger={false}
		on:rename
	/>
	<ContextMenuOption
		label="Delete"
		message="delete"
		icon="trash"
		danger={true}
		on:delete
	/> -->
<style lang="scss">
	@use "../../../style/global" as *;
	.main {
		@include flex(column, flex-start, center);
		border: 1px solid var(--border-color);
		box-sizing: border-box;
		border-radius: 4px;
		box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.07);
		background: var(--bg);
		padding: 0.25rem;
		z-index: 99;
		.divider {
			height: 1px;
			background: var(--border-color-light);
			width: calc(100% - 0.5rem);
			margin: 0.25rem 0;
			box-sizing: border-box;
		}
		.menu-option {
		@include flex(row, flex-start, center);
		height: 1.75rem;
		width: 12rem;
		border-radius: 3px;
		cursor: pointer;
		padding: 0 0.25rem;
		box-sizing: border-box;
		transition: 0.2s ease-in-out;
		.menu-option-text {
			@include ui-text-default($weight: 500);
			margin: 0 0 0 0;
		}
		&:hover {
			background: var(--bg-darker);
		}
		&.danger {
			> .menu-option-text {
				color: var(--red);
			}
			&:hover {
				background: var(--red-light);
			}
		}
	}
	}
</style>
