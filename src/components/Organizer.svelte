<script context="module" lang="ts">
</script>

<script lang="ts">

    //??: Svelte component imports
    import Button from './ui/Button.svelte';
	import Icons from './ui/Icons.svelte';
	import FlowTest from './FlowTest.svelte';

    //??: Local imports
	import { flows, selectedFlow } from '../scripts/stores';
	import { getFlows, newFlows, findFlowById } from '../scripts/chrome-storage';

    //??: Package imports
	import { dndzone, SOURCES, TRIGGERS } from 'svelte-dnd-action';
	import { fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

    //??: Local variables
	let activeFlow = null;
    let items;
	let dragDisabled = true;
	const flipDurationMs = 200;

    //??: On create
	selectedFlow.subscribe(flow => {
		activeFlow = flow;
	});

	flows.subscribe(flows => {
		items = flows;
	});

	browser.storage.onChanged.addListener(changes => {
		loadFlows();
	});

    loadFlows();

    //??: Functions
	async function loadFlows() {
		flows.set(await getFlows());
	}

	async function createFlow() {
		const newFlow = {
			name: 'Untitled',
			id: Date.now().toString(),
			defaultDb: null,
		};
		await newFlows(newFlow).then(() => {
			loadFlows();
		});
	}

	async function setSelectedFlow(id) {
		loadFlows();
		selectedFlow.set(await findFlowById(id));
		console.log(activeFlow);
	}

	function handleDndConsider(e) {
		const {
			items: newItems,
			info: { source, trigger },
		} = e.detail;
		items = newItems;
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			dragDisabled = true;
		}
	}
	function handleDndFinalize(e) {
		const {
			items: newItems,
			info: { source, trigger },
		} = e.detail;
		items = newItems;
		if (source === SOURCES.POINTER) {
			dragDisabled = true;
		}
		browser.storage.local.set({ flows: items });
	}
	function startDrag(e) {
		e.preventDefault();
		dragDisabled = false;
	}
	function handleKeyDown(e) {
		if ((e.key === 'Enter' || e.key === ' ') && dragDisabled) dragDisabled = false;
	}
</script>

<div class="home">
	{#if activeFlow !== null}
		<div in:fly={{ x: 400, duration: 200, delay: 200 }} out:fly={{ x: 400, duration: 200 }}>
			<FlowTest {...activeFlow} storedFlow={activeFlow} />
		</div>
	{:else}
		<div class="main" in:fly={{ x: -4400, duration: 200, delay: 200 }} out:fly={{ x: -400, duration: 200 }}>
			<div class="header"><h1>Notion Capture</h1></div>
			<div
				use:dndzone={{ items, dragDisabled, flipDurationMs }}
				on:consider={handleDndConsider}
				on:finalize={handleDndFinalize}
				class="flow-list">
				{#if items.length !== 0}
					{#each items as flow (flow.id)}
						<div
							class="flow-item"
							animate:flip={{ duration: flipDurationMs }}
							on:click={() => setSelectedFlow(flow.id)}>
							<div
								tabindex={dragDisabled ? 0 : -1}
								aria-label="drag-handle"
								class="handle"
								style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
								on:mousedown={startDrag}
								on:touchstart={startDrag}
								on:keydown={handleKeyDown}>
								<Icons name="grab_handle" color="default" size="med" />
							</div>
							<div class="flow-name">{flow.name}</div>
						</div>
					{/each}
				{:else}
					No flows found.
				{/if}
			</div>
			<div class="options-container">
				<Button value="+ New Flow" size="big" on:click={createFlow} />
				<Button value="+ New Folder" size="big" style="secondary" />
			</div>
		</div>
	{/if}
</div>

<style lang="less">
	@import '../style/global.less';
	.main {
		padding: 0 0 16px 0;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px 16px 24px 16px;
		> h1 {
			margin: 0px;
			padding: 0px;
			color: var(--ui-blue);
			font-weight: 700;
			text-transform: uppercase;
			font-size: 16px;
		}
	}
	.handle {
		border-radius: 4px;
		&:hover {
			background: var(--bg-darker);
		}
	}
	h1 {
		font-size: 16px;
		font-weight: normal;
		color: #333;
		padding: none;
	}
	.flow-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 36px;
		padding: 0px 8px;
		cursor: pointer;
		outline: none;
		&:hover {
			background-color: var(--bg-dark);
		}
		.flow-name {
			font-size: 14px;
			font-weight: 600;
			color: var(--text-dark);
			margin-left: 12px;
			margin-top: 1.5px;
		}
	}
	.options-container {
		display: flex;
		flex-direction: row;
		column-gap: 8px;
		padding: 0px 16px;
		margin-top: 16px;
	}
</style>
