<script>
	import { dndzone } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'

	import PropsNumber from './props/PropsNumber.svelte'
	import PropsSelect from './props/PropsSelect.svelte'
	import PropsMultiSelect from './props/PropsMultiSelect.svelte'
	import PropsStatus from './props/PropsStatus.svelte'
	import PropsDate from './props/PropsDate.svelte'
	import PropsPeople from './props/PropsPeople.svelte'
	import PropsFiles from './props/PropsFiles.svelte'
	import PropsCheckbox from './props/PropsCheckbox.svelte'
	import PropsPhoneNumber from './props/PropsPhoneNumber.svelte'
	import PropsRelation from './props/PropsRelation.svelte'
	import PropsFormula from './props/PropsFormula.svelte'
	import TextInput from './ui/TextInput.svelte'

	export let dbprops
	let items

	// FIX: props stores persist on db change

	let values = {}
	export let selection = {}

	const flipDurationMs = 300

	// INFO: Property sorting reference - change this to change default sort

	const propDefaultSort = [
		{ type: 'title' },
		{ type: 'select' },
		{ type: 'multi_select' },
		{ type: 'checkbox' },
		{ type: 'date' },
		{ type: 'rich_text' },
		{ type: 'number' },
		{ type: 'people' },
		{ type: 'files' },
		{ type: 'url' },
		{ type: 'email' },
		{ type: 'phone_number' },
		{ type: 'relation' },
		{ type: 'status' },
		{ type: 'formula' },
	]

	// INFO: Sorting function based on propDefaultSort

	function defaultPropSort(props, sortReference) {
		return props.sort((a, b) => {
			let aIndex = sortReference.findIndex(prop => prop.type === a.type)
			let bIndex = sortReference.findIndex(prop => prop.type === b.type)
			return aIndex - bIndex
		})
	}

	$: items = defaultPropSort(dbprops, propDefaultSort)
	$: selection
	$: console.log(items)
	function handleDndConsider(e) {
		items = e.detail.items
	}
	function handleDndFinalize(e) {
		items = e.detail.items
	}
</script>

<section
	class="props-container"
	use:dndzone={{ items, flipDurationMs }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}>
	{#each items as item (item.id)}
		<div class="dnditem" animate:flip={{ duration: flipDurationMs }}>
			{#if item.type === 'title'}
				<TextInput propType="title" props={item} />
			{:else if item.type === 'select'}
				<PropsSelect props={item} bind:value={values[item.name]} bind:selectionName={selection[item.name]} />
			{:else if item.type === 'multi_select'}
				<PropsMultiSelect
					props={item}
					bind:value={values[item.name]}
					bind:selectionName={selection[item.name]} />
			{:else if item.type === 'checkbox'}
				<PropsCheckbox props={item} bind:value={selection[item.name]} />
			{:else if item.type === 'date'}
				<PropsDate props={item} />
			{:else if item.type === 'rich_text'}
				<TextInput propType="rich_text" props={item} />
			{:else if item.type === 'number'}
				<PropsNumber props={item} />
			{:else if item.type === 'people'}
				<PropsPeople props={item} />
			{:else if item.type === 'files'}
				<PropsFiles props={item} />
			{:else if item.type === 'url'}
				<TextInput propType="url" props={item} />
			{:else if item.type === 'email'}
				<TextInput propType="email" props={item} />
			{:else if item.type === 'phone_number'}
				<PropsPhoneNumber props={item} />
			{:else if item.type === 'relation'}
				<PropsRelation props={item} />
			{:else if item.type === 'status'}
				<PropsStatus props={item} />
			{:else if item.type === 'formula'}
				<PropsFormula props={item} />
			{/if}
		</div>
	{/each}
</section>

<style lang="sass">
	.props-container 
		margin-bottom: 16px
	

	.input-container 
		display: flex
		flex-direction: row
	

	div 
	
	.dnditem 
		display: flex
		flex-direction: row
		align-items: center
		margin: 8px 0px
		width: 100%
		.grab-handle 
			height: 59px
			width: 8px
			border-radius: 6px
			margin-right: 8px
			background-color: rgba(255, 255, 255, 0.8)
			border: 1px solid rgba(0, 0, 0, 0.05)
			&:hover 
				cursor: grab
				background: rgba(0, 0, 0, 0.05)
</style>
