<script context="module" lang="ts">
    export type Name = string;
    export type Id = string;
</script>

<script lang="ts">
    // IMPT: Components
    import Icons from './ui/Icons.svelte';
    import Select from './ui/Select.svelte';
    import Button from './ui/Button.svelte';
    import HorRule from './ui/HorRule.svelte';
    import FlowOptions from './FlowOptions.svelte';

    // IMPT: Local
    import { GetAllDatabases, CreatePage } from '../scripts/api-endpoints';
    import { flows, selectedFlow } from '../scripts/stores';
    import { updateFlow, getFlows } from '../scripts/chrome-storage';
    import { isFullDatabase } from '@notionhq/client';

    // IMPT: Packages
    import { createEventDispatcher } from 'svelte';

    // VARS: Props
    export let name: Name;
    export let id: Id;
    export let defaultDb;
    export let storedFlow;

    // VARS: Local
    let databases = getDbs();
    let flowData = { name: name, id: id, defaultDb: defaultDb };
    let pendingChanges: boolean = false;
    let showSettings: boolean = false;
    const dispatch = createEventDispatcher();

    // FUNC: Start

    // get list of available dbs from the Notion API
    async function getDbs() {
        const dbs = await GetAllDatabases();
        return dbs;
    }

    // check that the the default DB is still valid
    (async function setDefaultDb() {
        if (flowData.defaultDb !== null) {
            const dbs = await databases;
            for (let i = 0; i < dbs.display.length; i++) {
                if (dbs.display[i].value === flowData.defaultDb.value) {
                    flowData.defaultDb.id = dbs.display[i].value;
                    console.log(
                        'Default db set to: ' + flowData.defaultDb.text
                    );
                    return;
                } else {
                    if (i === dbs.display.length - 1) {
                        flowData.defaultDb = null;
                        console.log('Default db not found');
                    }
                }
            }
        }
    })();

    // FUNC: Body

    // watch for local unsaved changes
    function watchChanges(flowData) {
        Object.keys(flowData).forEach((key) => {
            if (flowData[key] !== storedFlow[key]) {
                pendingChanges = true;
                return;
            }
        });
    }
    $: watchChanges(flowData);

    // FUNC: Handlers

    // save changes to chrome storage
    function saveChanges() {
        console.log(
            'Flow.svelte | saveChanges() | flowData sent for update: ',
            flowData
        );
        updateFlow(flowData)
            .then(() => {
                pendingChanges = false;
                dispatch('flowUpdated');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // set selected flow to null to return to the flow list
    function goBack() {
        selectedFlow.set(null);
    }

</script>

<div class="flow-page">
    <div class="flow-header">
        <Icons
            name="back"
            color="default"
            size="med"
            link={true}
            on:click={() => goBack()}
        />
        <h2>
            <input type="text" bind:value={flowData.name} />
        </h2>
        {#if pendingChanges}
            <div class="save-button">
                <Button
                    value="Save Changes"
                    style="outline"
                    size="small"
                    on:click={saveChanges}
                />
            </div>
        {/if}
        <Icons
            name="sliders"
            color="default"
            link={true}
            on:click={() => (showSettings = !showSettings)}
        />
        {#if showSettings}
            <div class="flow-settings">
                <FlowOptions />
            </div>
        {/if}
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
                <Select
                    options={null}
                    disabled={true}
                    placeholder="Loading..."
                />
            {:then options}
                <Select
                    options={options.display}
                    placeholder="Select Database..."
                    bind:selectedOption={flowData.defaultDb}
                />
            {/await}
        </div>
    </div>
    <HorRule noMargin={true} />
    <Button value="Capture" size="big" />
</div>

<style lang="scss">
    @use '../style/global' as *;
    .flow-page {
        padding: 18px 16px;
        display: flex;
        flex-direction: column;
        row-gap: 24px;
    }
    .input-label {
        @include flex('row', 'flex-start', 'center');
        margin-bottom: 4px;
        > h3 {
			@include h3();
            flex-grow: 1;
        }
    }
    .flow-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        column-gap: 4px;
        position: relative;
        > h2 {
            margin: 0 auto 0 -4px;
            padding: 0;
            height: 24px;
            display: flex;
            flex-direction: row;
            align-items: center;
            > input {
                font-size: 16px;
                font-weight: 600;
                color: var(--text-dark);
                padding: 0 0 0 4px;
                margin: 0 0 1px 0;
                width: 100%;
                border: 1px solid transparent;
                height: 24px;
                max-height: 24px;
                &:focus {
                    outline: none;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                }
            }
        }
        .flow-settings {
            position: absolute;
            top: 1.75rem;
            right: 0;
            z-index: 999;
        }
    }
</style>
