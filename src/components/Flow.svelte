<script lang="ts">
	import { CreatePage } from '../scripts/api-endpoints';
	import DatabaseProps from './DatabaseProps.svelte';
	import DatabaseSelect from './DatabaseSelect.svelte';
	import Icons from './Icons.svelte';

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
			<Icons name="back" link={true} />
			<h2>{flowData.name}</h2>
			<Icons name="sliders" link={true} />
		</div>
	</div>
	<div class="input-label">
		<Icons name="database" link={false} />
		<h3>Database</h3>
		<div class="options-handle">
			<Icons name="more" link={true} />
		</div>
	</div>
	<DatabaseSelect bind:dbProps bind:selectedDb />
	<div class="divider" />
	{#if dbProps}
		<DatabaseProps bind:dbprops={dbProps} bind:selection={propValues} />
	{/if}
	<div class="button primary large">
		<button on:click={() => CreatePage(apiPostContent)}>Capture</button>
	</div>
</div>

<style lang="less">
	.flow-page {
		padding: 16px;

	}

	.flow-header {
		margin: -16px -16px 0px -16px;
		padding: 0px 16px;
		height: 56px;
		position: sticky;
		top: -16px;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
		z-index: 9000;
		
		&::before,
		&::after {
			content: '';
			position: sticky;
			display: block;
			height: 16px;
            margin: 0px -16px;
		}
		&::before {
			top: 24px;
			box-shadow: 0 0px 16px 0 rgba(0, 0, 0, 0.2);
		}
		&::after {
			background: linear-gradient(white, rgba(255, 255, 255, 0.3));
			top: 0px;
			z-index: 9001;
		}
		> div {
			background: #ffffff;
			height: 40px;
			display: flex;
			flex-direction: row;
			align-items: center;
			margin: -16px -16px 0px -16px;
			z-index: 9002;
			position: sticky;
			top: 0px;
            padding: 0px 16px;
            > h2 {
			margin-right: auto;
			margin-left: 8px;
		}
		}
	}
</style>
