<script>
	import Svelecte, { addFormatter } from 'svelecte';
	import { GetAllDatabases, CreatePage } from '../scripts/api-endpoints';

	export let selectedDb;
	export let dbProps;

	const noIcon =
		'<svg viewBox="0 0 30 30" class="icon" style="width: 16px; height: 16px; display: block; fill: rgba(0, 0, 0, 0.4); flex-shrink: 0; backface-visibility: hidden;"><g> <path d="M16,1H4v28h22V11L16,1z M16,3.828L23.172,11H16V3.828z M24,27H6V3h8v10h10V27z M8,17h14v-2H8V17z M8,21h14v-2H8V21z M8,25h14v-2H8V25z"></path> </g></svg>';

	let dbOptions;
	let value;
	let dbOptionsFull;
	let dbOptionsDisplay;

	(async function getDatabases() {
		console.log('Getting DBs');
		const response = await GetAllDatabases();
		const res = {
			fullResponse: response,
			displayResponse: response.results.map((result, index) => {
				return {
					index: index,
					value: index,
					// @ts-ignore
					text: result.title[0].plain_text,
					// @ts-ignore
					icon: result.icon ? result.icon.file.url : 'noIcon',
				};
			}),
		};
		dbOptions = res.displayResponse;
		dbOptionsFull = res.fullResponse.results;
	})();

	function getSelectedDb(value) {
		if (dbOptionsFull !== undefined) {
			selectedDb = dbOptionsFull[value];
			dbProps = Object.values(dbOptionsFull[value].properties);
		}
	}

	$: getSelectedDb(value);

	function iconRenderer(item, isSelected) {
		if (item.icon === 'noIcon') {
			if (isSelected) {
				return `
            <div class="select-item">
                ${noIcon}
                ${item.text}
            </div>`;
			}
			return `
            <div class="select-item">
                ${noIcon}
                    ${item.text}
            </div>`;
		}
		if (isSelected) {
			return `
            <div class="select-item">
                <img 
                    class="icon"
                    src="${item.icon}" 
                    alt="${item.text}" 
                />
                ${item.text}
            </div>`;
		}
		return `
            <div class="select-item">
                <img 
                    class="icon"
                    src="${item.icon}" 
                    alt="${item.text}" 
                />
                    ${item.text}
            </div>`;
	}
	addFormatter('icon', iconRenderer);
</script>

<div>
	{#await dbOptions}
		<Svelecte disabled placeholder="Loading..." />
	{:then options}
		<Svelecte {options} renderer="icon" placeholder="Select Database..." bind:readSelect={selectedDb} bind:value />
	{/await}
</div>
