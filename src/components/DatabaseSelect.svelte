<script lang="ts">
	import Svelecte, { addFormatter } from 'svelecte';
	import { GetAllDatabases } from '../scripts/api-endpoints';

	const noIcon =
		'<svg viewBox="0 0 30 30" class="icon" style="width: 16px; height: 16px; display: block; fill: rgba(0, 0, 0, 0.4); flex-shrink: 0; backface-visibility: hidden;"><g> <path d="M16,1H4v28h22V11L16,1z M16,3.828L23.172,11H16V3.828z M24,27H6V3h8v10h10V27z M8,17h14v-2H8V17z M8,21h14v-2H8V21z M8,25h14v-2H8V25z"></path> </g></svg>';

	async function getDatabases() {
		console.log('Getting DBs');
		const response = await GetAllDatabases();
		const res = {
			fullResponse: response,
			displayResponse: response.results.map((result, index) => {
				return {
					index: index,
					value: index,
					text: result.title[0].plain_text,
					icon: result.icon ? result.icon.file.url : 'noIcon',
				};
			}),
		};
		console.log(res);
		return res.displayResponse;
	}

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

	async function getCurrentTab() {
		let queryOptions = { active: true, lastFocusedWindow: true };
		let [tab] = await browser.tabs.query(queryOptions);
		const tabInfo = {
			id: tab.id,
			title: tab.title,
			url: tab.url,
			favicon: tab.favIconUrl,
		};
		return tabInfo;
	}

	const dbOptions = getDatabases();
	const tabInfo = getCurrentTab();

	getCurrentTab();
</script>

<div>
	{#await dbOptions}
		<div>Loading</div>
	{:then options}
		<Svelecte {options} renderer="icon" placeholder="Select Database..." />
	{/await}
	{#await tabInfo}
		<div>Loading</div>
	{:then tab}
		<div class="tab-info">
			<label for="tab-title" class="input-label">Title</label>
			<input id="tab-title" class="tab-title" value={tab.title} />
			<label for="tab-url" class="input-label">URL</label>
			<input id="tab-url" class="tab-title" value={tab.url} />
			<div class="input-label">Icon</div>
			<div class="tab-favicon">
				<img src={tab.favicon} alt={tab.title} />
			</div>
		</div>
	{/await}
</div>

<style>
	.tab-info {
		margin-top: 12px;
	}

	.tab-title {
		width: 100%;
		height: 38px;
		border-radius: 4px;
		outline: none;
		border: 1px solid #ccc;
		padding: 0px 12px;
		box-sizing: border-box;
		margin-top: 4px;
	}
	.input-label {
		display: block;
		font-weight: 600;
		font-size: 14px;
		color: rgb(167, 167, 167);
		padding-top: 8px;
	}
</style>
