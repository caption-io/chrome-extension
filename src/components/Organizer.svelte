<script context="module" lang="ts">
</script>
<!-- SECT: SCRIPT -->
<script lang="ts">
	// IMPT: Packages
	import { dndzone, SOURCES, TRIGGERS } from "svelte-dnd-action";
	import { fly, fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { nanoid } from "nanoid";
	import { filter, groupBy, includes } from "lodash-es";

	// IMPT: Components
	import Button from "./ui/Button.svelte";
	import Icon from "./ui/Icon.svelte";
	import Flow from "./Flow.svelte";
	import TextInput from "./ui/TextInput.svelte";

	// IMPT: Local
	import { flows, selectedFlow, settings, tags } from "../scripts/stores";
	import {
		getFlows,
		newFlows,
		findFlowById,
		getSettings,
	} from "../scripts/chrome-storage";

	// VARS: Local
	let activeFlow = null;
	let items;
	let itemsSearch;
	let userSettings: UserSettings;
	let dragDisabled = true;
	const flipDurationMs = 200;
	let flowId = "first!";
	let searchQuery: string | null = null;
	const newFlow: FlowData = {
		name: "Untitled",
		id: flowId,
		defaultDatabase: null,
		tags: null,
		favorite: false,
	};

	$: ((items) => {
		newFlow.id = nanoid(16);
	})(items);

	// FUNCS: Main

	// FUNC: Load Flows
	const loadFlows = async () =>
		await getFlows().then((res) => {
			flows.set(res);
			return res;
		});

	// FUNC: Load Settings
	const loadSettings = async () =>
		await getSettings().then((res) => {
			settings.set(res);
		});

	// FUNC: Create Flow
	const createFlow = async () => await newFlows(newFlow).then(loadFlows);

	// FUNC: Set Selected Flow
	const setSelectedFlow = async (id) => {
		loadFlows();
		selectedFlow.set(await findFlowById(id));
	};

	//! FUNCS

	// FUNC: Start
	loadFlows();
	loadSettings();

	selectedFlow.subscribe((flow) => (activeFlow = flow));

	$: itemsSearch = $flows.filter(flow => {
		if (searchQuery)
			return flow.name.toLowerCase().includes(searchQuery.toLowerCase());
			else return true;
	});

	// $: items = groupBy(itemsSearch, "tags");
	$: items = $flows;
	$: itemTags = Object.keys(groupBy(items, "tags"));

	settings.subscribe((settings) => {
		userSettings = settings;
	});

	browser.storage.onChanged.addListener((changes) => {
		for (let key in changes) {
			if (key === "flows") {
				loadFlows();
			}
		}
	});

	// FUNCS: Event Handlers

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
		if ((e.key === "Enter" || e.key === " ") && dragDisabled)
			dragDisabled = false;
	}

	//! FUNCS


</script>
<!-- !SECT -->

<!-- SECT: MARKUP -->
<div class="container">
	<div
		class="main"
		in:fly={{ x: -4400, duration: 200, delay: 200 }}
		out:fly={{ x: -400, duration: 200 }}
		style={`filter: ${
			$selectedFlow === null
				? "blur(0px) brightness(1)"
				: "blur(2px) brightness(0.75)"
		};`}
	>
		<div class="header">
			<TextInput
				placeholder="Search"
				bind:value={searchQuery}
				inputIcon="search"
			/>
		</div>
		{#if items.length !== 0}
				<section
					use:dndzone={{ items, dragDisabled, flipDurationMs }}
					on:consider={(e) => handleDndConsider(e)}
					on:finalize={(e) => handleDndFinalize(e)}
					class="flow-list"
				>
					{#each items as flow (flow.id)}
					
							<div
								class="flow-item"
								animate:flip={{ duration: flipDurationMs }}
								in:fade={{ duration: 200 }}
								on:click={() => setSelectedFlow(flow.id)}
							>
								<div
									tabindex={dragDisabled ? 0 : -1}
									aria-label="drag-handle"
									class="handle"
									style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
									on:mousedown={startDrag}
									on:touchstart={startDrag}
									on:keydown={handleKeyDown}
								>
									<Icon
										name="grab_handle"
										color="grey"
										size="med"
										link={false}
										light={true}
									/>
								</div>
								<div class="flow-name">
									{flow.name}
								</div>
							</div>
					{/each}
				</section>
		{:else}
			<div class="no-flows">No flows found.</div>
		{/if}
		<div class="options-container">
			<Button
				value="New Flow"
				size="med"
				style="primary"
				color="blue"
				icon="flowPlus"
				iconPosition="left"
				on:click={createFlow}
			/>
			<Button
				value="Quick Flow"
				icon="zap"
				iconPosition="left"
				size="med"
				style={userSettings.defaultFlow === null ? "disabled" : "primary"}
				color="blue"
			/>
			<Button size="med" icon="sliders" style="secondary" color="blue" />
		</div>
	</div>
	{#if $selectedFlow !== null}
		{#key $selectedFlow.id}
			<div
				in:fly={{ x: 600, duration: 300 }}
				out:fly={{ x: 600, duration: 400 }}
				class="flow"
			>
				<Flow
					{...$selectedFlow}
					storedFlow={$selectedFlow}
					on:flowUpdated{loadFlows()}
				/>
			</div>
		{/key}
	{/if}
</div>
<!-- !SECT -->

<!-- SECT: STYLE -->
<style lang="scss">
	@use "../style/global" as *;

	@keyframes blurin {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
	.container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		position: relative;
		width: 100%;
	}

	.main {
		@include flex(column, center, center);
		height: 600px;
		width: 100%;
		position: relative;
		overflow: hidden;
		transition: 0.2s ease-in-out;
		background: var(--bg);
	}
	.header {
		@include flex(column, flex-start, center);
		padding: 0.75rem 1.25rem 0.75rem 1.25rem;
		row-gap: 0.75rem;
		background: var(--bg-dark);
		width: 100%;
		box-sizing: border-box;
		flex-shrink: 1;
		.header-top {
			@include flex(row, center, center);
			width: 100%;
		}
		.header-text {
			@include h1(var(--blue-900));
		}
	}
	.handle {
		border-radius: 0.3rem;
		&:hover {
			background: var(--bg-darker);
		}
	}
	.flow-list {
		flex-grow: 1;
		width: 100%;
		overflow-y: auto;
		height: auto;
		transition: height 200ms ease-in-out;
		.flow-item {
			@include flex();
			height: 2rem;
			padding: 0px 8px;
			cursor: pointer;
			outline: none;
			&:hover {
				background-color: var(--bg-dark);
			}
			.flow-name {
				@include ui-text-default($weight: 600);
				margin-left: 0.8rem;
				margin-top: 1.5px;
			}
		}
		@include scrollbar();
	}

	.flow {
		position: absolute;
		top: 0;
		overflow: hidden;
		width: 100%;
	}
	.options-container {
		display: flex;
		flex-direction: row;
		column-gap: 8px;
		padding: 0.75rem 1rem;
		background: var(--bg-dark);
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid var(--border-color-light);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.04) inset;
	}

	.no-flows {
		flex-grow: 1;
		font-size: 1rem;
		font-weight: 600;
		height: 4rem;
		width: 100%;
		color: var(--grey-600);
		@include flex(row, center, center);
	}
</style>
<!-- !SECT -->