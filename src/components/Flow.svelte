<script lang="ts">
	import { CreatePage } from '../scripts/api-endpoints';
	import DatabaseProps from './DatabaseProps.svelte';
	import DatabaseSelect from './DatabaseSelect.svelte';
	import Icons from './ui/Icons.svelte';
	import Button from './ui/Button.svelte';
	import {fade,fly} from 'svelte/transition';


	export let flowData = {
		name: 'Simple Web Clip',
	};

	let dbProps;
	let selectedDb;
	let propValues;
	let apiPostContent;

	function apiJSONFormatter(propValues) {
		apiPostContent = {
			parent: {
				type: 'database_id',
				database_id: selectedDb ? selectedDb.id.toString() : '',
			},
			properties: propValues,
			children: [],
		};
		console.log(apiPostContent);
	}

	// INFO: Gets web page info, *TURN THIS INTO A MODULE*

	$: apiJSONFormatter(propValues);
	$: console.log(selectedDb);


</script>

<div class="flow-page">
	<div class="flow-header">
		<div>
			<Icons
				name='back'
				color='default'
				size='med'
				link={true}
			/>
			<h2>
				{flowData.name}
			</h2>
			<Icons
				name='sliders'
				color='default'
				link={true}
			/>
		</div>
	</div>
	<div class="input-label">
		<Icons 
			name='database'
			size='med'
			position='left'
		/>
		<h3>Database</h3>
		<div class="options-handle">
			<Icons 
				name='more'
				size='med'
				position='center'
				link={true}
			/>
		</div>
	</div>
	<DatabaseSelect bind:dbProps bind:selectedDb />
	<div class="divider" />
	{#if dbProps}
	<div transition:fly="{{ y: 200, duration: 500 }}">
		<DatabaseProps bind:dbprops={dbProps} bind:selection={propValues} />
		<Button
		props={{
			value: 'Capture',
			size: 'big',
			color: 'outline',
			onClick: handleClick,
		}} />
	</div>
	{/if}
</div>

<style lang="sass">
	@import '../style/global'

	.flow-page 
		padding: 16px

	.flow-header 
		margin: -16px -16px 0px -16px
		padding: 0px 16px
		height: 56px
		position: sticky
		top: -16px
		-webkit-backface-visibility: hidden
		backface-visibility: hidden
		z-index: 9000
		&::before,
		&::after 
			content: ''
			position: sticky
			display: block
			height: 16px
			margin: 0px -16px
		&::before 
			top: 24px
			box-shadow: 0 0px 16px 0 rgba(0, 0, 0, 0.2)
		&::after 
			background: linear-gradient(white, rgba(255, 255, 255, 0.3))
			top: 0px
			z-index: 9001
		> div 
			background: #ffffff
			height: 40px
			display: flex
			flex-direction: row
			align-items: center
			margin: -16px -16px 0px -16px
			z-index: 9002
			position: sticky
			top: 0px
			padding: 0px 16px
			> h2 
				margin-right: auto
				margin-left: 8px

</style>
