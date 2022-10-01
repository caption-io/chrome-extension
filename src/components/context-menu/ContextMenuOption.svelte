<script lang="ts">
	// IMPT: Packages
	import { createEventDispatcher } from "svelte";

	// IMPT: Components
	import Icon from "../ui/Icon.svelte";

	// VARS: Props
	export let label: string;
	export let message: string;
	export let icon: Icons;
	export let danger: boolean = false;

	// VARS: Local
	let hoverColor: AppColors = danger ? "red" : "grey";

	// VARS: Utils
	const dispatch = createEventDispatcher();

	// FUNCS: Event Handlers


	const handleClick = (option: string) => dispatch(option);
</script>

<div
	class={`menu-option ${danger ? "danger" : ""}`}
	on:click={() => dispatch(message)}
>
	<Icons
		name={icon}
		size="med"
		bind:color={hoverColor}
		position="right"
		light={danger ? false : true}
	/>
	<div class="menu-option-text">{label}</div>
</div>

<style lang="scss">
	@use "../../style/global" as *;
	.menu-option {
		@include flex(row, flex-start, center);
		height: 1.75rem;
		width: 12rem;
		border-radius: 4px;
		cursor: pointer;
		.menu-option-text {
			@include ui-text-default($weight: 500);
			padding: 0.25rem 0.25rem;
			margin: 1px 0 0 0;
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
</style>
