<script context="module" lang="ts">
</script>

<!-- SECT: SCRIPT -->
<script lang="ts">
	// IMPT: Packages
	import { dndzone } from "svelte-dnd-action";
	import { fly, fade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { nanoid } from "nanoid";

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
	import {
		handleDndConsider,
		handleDndFinalize,
		startDrag,
		handleKeyDown,
	} from "../scripts/ui-utils";
	import { includes } from "lodash-es";
	// VARS: Local
	let activeFlow = null;
	let items;
	let itemsSearch;
	let userSettings: UserSettings;
	let flowId = "first!";
	let searchQuery: string | null = null;
	const newFlow: FlowData = {
		name: "Untitled",
		id: flowId,
		defaultDatabase: null,
		tags: null,
		favorite: false,
		captureCount: 0,
	};
	let flipDurationMs = 300;

	function handleSort(e) {
		flows.set(e.detail.items);
	}

	$: ((items) => {
		newFlow.id = nanoid(16);
	})(items);

	// FUNCS: Main

	// FUNC: Load Flows
	const loadFlows = async () =>
		await getFlows().then((res) => {
			flows.set(res);
			console.log("Flows loaded: ", res);
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
	const setSelectedFlow = async (flow) => {
		loadFlows();
		selectedFlow.set(flow);
	};

	//! FUNCS

	// FUNC: Start
	loadFlows();
	loadSettings();

	selectedFlow.subscribe((flow) => (activeFlow = flow));
	flows.subscribe((flows) => (items = flows));

	$: itemsSearch = $flows.filter((flow) => {
		if (searchQuery)
			return flow.name.toLowerCase().includes(searchQuery.toLowerCase());
		else return true;
	});

	// $: items = groupBy(itemsSearch, "tags");
	settings.subscribe((settings) => {
		userSettings = settings;
	});

	browser.storage.onChanged.addListener((changes) => {
		for (let key in changes) {
			if (key === "flows") {
				loadFlows();
				console.log("Flows changed in browser storage");
			}
		}
	});
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
				type="text"
				option={{ name: "Search", id: "uniSearch" }}
			/>
		</div>
		{#if items.length !== 0}
			<div class="flow-list">
				{#each items as flow (flow.id)}
					{#if $flows.includes(flow)}
						<div
							class="flow-item"
							in:fade={{ duration: 200 }}
							on:click={() => setSelectedFlow(flow)}
						>
							<div class="handle">
								<Icon
									name="grab_handle"
									color="grey"
									size="med"
									link={false}
									light={true}
								/>
							</div>
							<div class="flow-info">
								<div class="flow-name">
									{flow.name}
								</div>
								<div class="flow-defaultdb">
									{#if flow.defaultDatabase}
										<div class="flow-defaultdb-icon">
											{#if flow.defaultDatabase.icon}
												<img
													src={flow.defaultDatabase.icon.toString()}
													alt="icon"
												/>
											{:else}
												<Icon
													name="doc"
													size="small"
													color="grey"
													light={true}
													position="left"
												/>
											{/if}
										</div>
										<p class="flow-defaultdb-name">
											{flow.defaultDatabase.name}
										</p>
									{:else}
										<p class="flow-defaultdb-name">No Default Database</p>
									{/if}
								</div>
							</div>
							<div class="chevron">
								<Icon
									name="chevronRight"
									color="grey"
									size="med"
									link={false}
									light={true}
									position="left"
								/>
							</div>
						</div>
					{/if}
				{/each}
			</div>
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
				style={userSettings.defaultPopupFlow === null ? "disabled" : "primary"}
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
		background: var(--bg-darkish);
	}
	.header {
		@include flex(column, flex-start, center);
		padding: 0.75rem 1.25rem 0.75rem 1.25rem;
		row-gap: 0.75rem;
		background: var(--bg-darker);
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
		@include scrollbar();
		flex-grow: 1;
		width: 100%;
		overflow-y: auto;
		height: auto;
		transition: 200ms ease;
	}
	.flow-item {
		@include flex();
		padding: 0.5rem 0.5rem;
		cursor: pointer;
		outline: none;
		transition: 200ms ease;
		.flow-info {
			@include flex(column, flex-start, flex-start);
			margin-left: 0.75rem;
			flex-grow: 1;
			row-gap: 0.25rem;

			.flow-name {
				@include ui-text(var(--text-dark) !important, 0.875rem, 600);
			}
			.flow-defaultdb {
				@include flex(row, center, center);
				.flow-defaultdb-icon {
					@include flex(row, center, center);
					img {
						width: 0.75rem;
						height: 0.75rem;
						border-radius: 0.2rem;
						opacity: 0.7;
					}
				}
				.flow-defaultdb-name {
					@include ui-text(var(--text-light), 0.75rem, 400);
				}
			}
		}
		.chevron {
			opacity: 0;
			margin-right: 0.5rem;
			transition: 100ms ease;
		}
		&:hover {
			background-color: var(--bg);
			box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.04);

			.chevron {
				opacity: 0.8;
			}
		}
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
