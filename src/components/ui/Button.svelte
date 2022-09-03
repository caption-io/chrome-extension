<script context="module" lang="ts">

	// import icons list
	import  Icons, { icons }  from './Icons.svelte'

	// prop types
	export type Value = string | null
	export type Size = 'small' | 'med' | 'big'
	export type Style = 'primary' | 'secondary' | 'outline' | 'danger'
	export type Icon = keyof typeof icons
	export type IconPosition = 'left' | 'right'
	export type Disabled = boolean

</script>

<script lang="ts">
	// exported props
	export let value: Value = null
	export let size: Size = 'med'
	export let style: Style = 'primary'
	export let icon: Icon = null
	export let iconPosition: IconPosition = 'left'
	export let disabled: Disabled = false

	// local variables
	let pressed = false

	// css class definitions
	const cssClass = `button
		${' ' + size}
		${' ' + style}
		${disabled ? 'disabled' : ''}
		`

</script>

<div class="button-container">
	<button class={cssClass} on:click on:mousedown={() => (pressed = true)}>
		{#if value && icon && iconPosition === 'left'}
			<Icons
				name={icon}
				size={size}
				color={style}
				position={iconPosition}
				disabled={disabled}
			/>
		{/if}
		{#if !value && icon}
		<Icons
				name={icon}
				size={size}
				color={style}
				position={'center'}
				disabled={disabled}
			/>
		{/if}
		{#if value}
		{value}
		{/if}
		{#if value && icon && iconPosition === 'right'}
			<Icons
				name={icon}
				size={size}
				color={style}
				position={iconPosition}
				disabled={disabled}
			/>
		{/if}
	</button>
</div>

<style lang="sass">
	@use '../../style/global' as g

	.button-container 
		display: flex
		flex-direction: row
		justify-content: center
		align-items: center
		margin: 0
		width: 100%
		.button 
			@include g.flex($dir: row, $justify: center)
			border: 1px solid transparent
			background: none
			font-weight: 400
			transition: 250ms
			cursor: pointer
			&.small 
				padding: 0 0.5rem
				height: 1.5rem
				font-size: 0.8rem
			&.med 
				padding: 0 1rem
				height: 2rem
			&.big 
				width: 100%
				height: 2rem
			&.primary 
				background-color: var(--ui-blue)
				color: #fff
				&:hover 
					background-color: var(--ui-blue-hover)
			&.secondary 
				background-color: var(--bg-darker)
				color: var(--text-dark)
				&:hover 
					background-color: var(--bg-darkest)
			&.danger 
				background-color: var(--bg)
				border: 1px solid var(--ui-red)
				font-weight: 500
				color: var(--ui-red)
				&:hover 
					border: 1px solid var(--ui-red-hover)
					background-color: var(--ui-red-hover)
					color: #fff
			&.outline 
				border: 1px solid var(--ui-blue)
				font-weight: 500
				color: var(--ui-blue)
				&:hover 
					border: 1px solid var(--ui-blue-hover)
					color: var(--ui-blue-hover)
			&.disabled 
				background-color: #e0e0e0
				color: #bdbdbd
				pointer-events: none
	
</style>