<script lang="ts">
	import Svelecte, { addFormatter } from 'svelecte';
	import { GetAllDatabases } from '../scripts/api-endpoints';

	async function getDatabases() {
		console.log('Getting DBs');
		const response = await GetAllDatabases();
		const res = {
			fullResponse: response,
			displayResponse: response.results.map(result => {
				return {
					value: result.id,
					text: result.title[0].plain_text,
					icon: result.icon ? result.icon.file.url : null,
				};
			}),
		};
		console.log(res);
		return res.displayResponse;
	}

	function iconRenderer(item, isSelected) {
		if (isSelected) {
			return `
            <div class="select-item">
                <img 
                    src="${item.icon}" 
                    alt="${item.text}" 
                />
                ${item.text}
            </div>`;
		}
		return `
            <div class="select-item">
                <img 
                    src="${item.icon}" 
                    alt="${item.text}" 
                />
                    ${item.text}
            </div>`;
	}
	addFormatter('icon', iconRenderer);

	const dbOptions = getDatabases();
</script>

<div>
	{#await dbOptions}
		<div>Loading</div>
	{:then options}
		<Svelecte {options} renderer="icon" placeholder="Select Database..." />
	{/await}
</div>

<style>
</style>
