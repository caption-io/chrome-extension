<script context="module" lang="ts">
	// interface OptionsArray as array with { text: string, value: string, icon?: string } as each entry
	export type OptionsArray = Array<{ text: string; value: string; icon?: string }>

	export type Options = OptionsArray
	export type Placeholder = string
	export type SelectedOption = {
		text: string
		value: string
		icon?: string
	}
	export type Disabled = boolean
</script>

<script lang="ts">
	import Icons from './Icons.svelte'

	export let options: Options | null = null
	export let placeholder: Placeholder = 'Select...'
	export let disabled: Disabled = false
	export let selectedOption: SelectedOption | null = null

	let dropdownOpen = false
	let displayValue

	function inputClick() {
		dropdownOpen = !dropdownOpen
	}

	$: displayValue = selectedOption ? selectedOption.text : placeholder

	$: console.log(selectedOption)
</script>

<div class="select-container">
	<div class="select-input-container">
		{#if selectedOption && selectedOption.icon}
			<Icons url={selectedOption.icon} size="small" position="left" />
		{/if}
		<input
			readonly
			type="text"
			class={`select-input${disabled ? ' disabled' : ''}`}
			on:click={inputClick}
			{placeholder}
			bind:value={displayValue} />
	</div>
	{#if dropdownOpen}
		<div class="select-dropdown">
			{#each options as option}
				<div
					class="select-dropdown-item"
					on:click={() => {
						selectedOption = option
						dropdownOpen = false
					}}>
					<div class="select-dropdown-item-icon">
						{#if option.icon}
							<Icons url={option.icon} size="small" position="left" />
						{/if}
					</div>
					<div class="select-dropdown-item-text">{option.text}</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	@use '../../style/global' as *;

	.select-container {
		display: flex;
		flex-direction: column;
		margin: 0px;
		box-sizing: border-box;
		position: relative;
		pointer-events: none;
		.select-input-container {
			display: flex;
			flex-direction: row;
			align-items: center;
			border: 1px solid var(--border-color);
			border-radius: 4px;
			box-sizing: border-box;
			pointer-events: none;
			padding: 0px 8px;
			.select-input {
				@include ui-text-default();
				border: 1px solid transparent;
				height: 36px;
				width: 100%;
				outline: none;
				padding: 0 0px;
				margin: 0;
				background: transparent;
				pointer-events: all;
				&.disabled {
					pointer-events: none;
					background: var(--bg-dark);
				}
			}
		}
		.select-dropdown {
			position: absolute;
			top: 100%;
			transform-origin: 0% 0%;
			display: flex;
			flex-direction: column;
			padding: 0px 0px;
			margin: 8px 0px 16px 0px;
			border: 1px solid var(--border-color);
			border-radius: 4px;
			width: 100%;
			background: #fff;
			z-index: 999;
			.select-dropdown-item {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 32px;
				padding: 0px 8px;
				pointer-events: all;
				font-family: var(--font-family);
				font-size: 14px;
				color: var(--text-dark);
				font-weight: 500;
				&:hover {
					background: var(--bg-darker);
				}
			}
		}
	}
</style>
