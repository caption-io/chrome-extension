<script>
	import Svelecte, { addFormatter } from 'svelecte';
    import Select from './ui/Select.svelte';
	import { GetAllDatabases, CreatePage } from '../scripts/api-endpoints';


	let databases = getDatabases();
	let value;
	let dbOptionsFull;
	let dbOptionsDisplay;

	async function getDatabases() {
		const response = await GetAllDatabases();
		return response;
	};

	
</script>

<div>
	{#await databases}
		<Select options={null} disabled={true} placeholder="Loading..." />
	{:then options}
		<Select options={options.display} placeholder="Select Database..." />
	{/await}
</div>
