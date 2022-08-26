<script context="module" lang="ts">
	export type Name = string;
	export type Id = string;
	export type DefaultDb = string | null;
</script>

<script lang="ts">
	import Icons from './ui/Icons.svelte';
	import Select from './ui/Select.svelte';
	import Button from './ui/Button.svelte';
	import { GetAllDatabases, CreatePage } from '../scripts/api-endpoints';
	import { flows, selectedFlow } from '../scripts/stores';
    import { updateFlow, getFlows } from '../scripts/chrome-storage';

	export let name: Name;
	export let id: Id;
	export let defaultDb: DefaultDb;
	export let storedFlow;

	let databases;

	let flowData = { name: name, id: id, defaultDb: defaultDb };
	let pendingChanges: boolean = false;

    (async function onLoad() {
		databases = await GetAllDatabases();
    })();


	function watchChanges(flowData) {
		Object.keys(flowData).forEach(key => {
			if (flowData[key] !== storedFlow[key]) {
				pendingChanges = true;
                return;
			}
		});
	}
	$: watchChanges(flowData);

    function saveChanges() {
        updateFlow(flowData)
            .then(() => {
                pendingChanges = false;
            })
            .catch(error => {
                console.log(error);
            }
        );
    }
</script>

<div class="flow-page">
	<div class="flow-header">
			<Icons name="back" color="default" size="med" link={true} on:click={() => selectedFlow.set(null)} />
			<h2>
				<input type="text" bind:value={flowData.name} />
			</h2>
			{#if pendingChanges}
            <div class="save-button">
				<Button value="Save Changes" style="outline" size="small" on:click={saveChanges}/>
            </div>
			{/if}
			<Icons name="sliders" color="default" link={true} />
	</div>
    <div>
	<div class="input-label">
		<Icons name="database" size="med" position="left" />
		<h3>Database</h3>
		<div class="options-handle">
			<Icons name="more" size="med" position="center" link={true} />
		</div>
	</div>
	<div>
		{#await databases}
			<Select options={null} disabled={true} placeholder="Loading..." />
		{:then options}
			<Select
				options={options.display}
				bind:selectedOption={flowData.defaultDb}
				placeholder="Select Database..." />
		{/await}
	</div>
</div>
	<div class="divider" />
	<Button value="Capture" size="big" />
</div>

<style lang="less">
    @import '../style/global.less';
	.flow-page {
		padding: 18px 16px;
        display: flex;
        flex-direction: column;
        row-gap: 24px;
	}

    .input-label {
        margin-bottom: 4px;
    }

	.flow-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 4px;
        > h2 {
            margin: 0 4px 0 -4px;
            padding: 0;
            flex-grow: 1;
            height: 24px;
            display: flex;
            flex-direction: row;
            align-items: center;

            > input {
                border: none;
                font-size: 16px;
                font-weight: 600;
                color: var(--text-dark);
                padding: 0;
                margin: 0 0 1px 0;
                width: 100%;
                border: 1px solid transparent;
                height: 24px;
                max-height: 24px;
                padding-left: 4px;

                
                &:focus {
                    outline: none;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                }
            }
        }
	}
</style>
