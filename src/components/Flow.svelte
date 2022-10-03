<script lang="ts">
	// IMPT: Components
	import Icon from "./ui/Icon.svelte";
	import Button from "./ui/Button.svelte";
	import ContextMenu from "./context-menu/ContextMenu.svelte";
	import Props from "./Props.svelte";

	// IMPT: Local
	import { GetAllDatabases } from "../scripts/api-endpoints";
	import { selectedFlow, flows } from "../scripts/stores";
	import {
		updateFlow,
		deleteFlow,
		updateFlowName,
		updateFlowTags,
		getFlows,
	} from "../scripts/chrome-storage";
	import { WithIcon } from "../scripts/svelecte-renderers";
	import { clickAnimation } from "../scripts/ui-utils";

	// IMPT: Packages
	import { createEventDispatcher } from "svelte";
	import Svelecte, { addFormatter } from "svelecte";
	import { fade } from "svelte/transition";
	import { flow, isEqual, omit } from "lodash-es";

	// VARS: Variable Setter Functions
	const getDbs = async () =>
		await GetAllDatabases().then((res) => {
			if ($selectedFlow.defaultDatabase) {
				for (let r in res) {
					if ($selectedFlow.defaultDatabase.id === res[r].id) {
						selectedFlow.set({
							...$selectedFlow,
							defaultDatabase: res[r],
						});
					}
				}
			}
			return res;
		});
	const dispatch = createEventDispatcher();

	// VARS: Props
	export let name: FlowData["name"];
	export let id: FlowData["id"];
	export let defaultDatabase: DefaultDatabase;
	export let tags: FlowData["tags"];
	export let captureCount: FlowData["captureCount"];
	export let storedFlow: FlowData;

	// VARS: Local
	let databases = getDbs();
	let flowData: FlowData = {
		name: name,
		id: id,
		defaultDatabase: defaultDatabase,
		tags: tags,
		favorite: false,
		captureCount: captureCount,
	};
	let changesPending: boolean = false;
	let showSettings: boolean = false;
	let confirmDelete: boolean = false;
	let selectedDatabase = flowData.defaultDatabase
		? flowData.defaultDatabase
		: null;
	let nameInput: HTMLInputElement;
	let props;

	// VARS: Shorthands

	// FUNC: Listeners

	// watch for user changes to Flow vs the stored Flow
	$: ((f, s) => {
		console.log("f", f);
		console.log("s", s);
		if (!f.defaultDatabase && !s.defaultDatabase) {
			changesPending = false;
		} else if (!f.defaultDatabase && s.defaultDatabase) {
			changesPending = true;
		} else if (f.defaultDatabase && !s.defaultDatabase) {
			changesPending = true;
		} else if (
			f.defaultDatabase &&
			s.defaultDatabase &&
			isEqual(f.defaultDatabase.name, s.defaultDatabase.name)
		) {
			changesPending = false;
		} else changesPending = true;
	})(flowData, storedFlow);

	// set properties when new Notion database is selected
	$: ((fd: FlowData) => {
		fd.defaultDatabase ? (props = fd.defaultDatabase.props) : null;
	})(flowData);

	// FUNC: Event Handlers

	// save changes to chrome storage
	const saveChanges = () => {
		updateFlow(flowData).then(() => {
			changesPending = false;
			dispatch("flowUpdated");
			nameInput.blur();
		});
	};

	const saveName = () => {
		updateFlowName(flowData).then(() => {
			nameInput.blur();
		});
	};

	const saveTags = () => {
		updateFlowTags(flowData).then(() => {});
	};

	const deleteCurrentFlow = () => {
		deleteFlow(flowData.id).then(() => {
		selectedFlow.set(null);
		});
	};

	const handleFlowOptionClick = (e) => {
		if (e.detail.text === "delete") {
			confirmDelete = true;
			showSettings = false;
		} else if (e.detail.text === "rename") {
			nameInput.focus();
			nameInput.select();
			showSettings = false;
		} else if (e.detail.text === "favorite") {
			if (flowData.tags !== null) {
				flowData.tags.includes("favorite")
					? (flowData.tags = flowData.tags.filter((tag) => tag !== "favorite"))
					: flowData.tags.push("favorite");
			} else flowData.tags = ["favorite"];
			saveTags();
		}
	};

	// const loadFlows = async () =>
	// 	await getFlows().then((res) => {
	// 		flows.set(res);
	// 		return res;
	// 	});

	// set selected flow to null to return to the flow list
	const goBack = () => selectedFlow.set(null);

	console.log(selectedDatabase);
	addFormatter("dbSelect", WithIcon);
</script>

<div class="flow-page">
	<div class="flow-header">
		<Icon
			name="back"
			color="grey"
			size="med"
			link={true}
			on:click={() => goBack()}
		/>
		<h2>
			<input
				type="text"
				bind:this={nameInput}
				bind:value={flowData.name}
				on:keydown={(e) => (e.key == "Enter" ? saveName() : null)}
				on:click={() => nameInput.select()}
				on:blur={() => saveName()}
			/>
		</h2>
		{#if changesPending}
			<Button
				value="Save Changes"
				style="outline"
				size="small"
				on:click={saveChanges}
			/>
		{/if}
		<Icon
			name="sliders"
			color="blue"
			link={true}
			on:click={(e) => {
				showSettings = !showSettings;
				clickAnimation(e, "default");
			}}
		/>
		{#if showSettings}
			<div class="flow-settings">
				<ContextMenu
					options={[
						{
							label: "Favorite",
							message: "favorite",
							icon: "favorite",
						},
						{
							label: "Rename",
							message: "rename",
							icon: "rename",
						},
						"divider",
						{
							label: "Delete",
							message: "delete",
							icon: "trash",
							style: "danger",
						},
					]}
					on:message={(e) => handleFlowOptionClick(e)}
				/>
			</div>
		{/if}
	</div>
	<div class="database-select">
		<div class="input-label">
			<Icon
				name="database"
				size="med"
				position="left"
				color="grey"
				light={true}
			/>
			<h3>Database</h3>
			<div
				class="options-handle refresh"
				on:mousedown={(e) => clickAnimation(e, "default")}
			>
				<div class="refresh-text">
					<Icon
						name="refresh"
						size="small"
						position="left"
						color="grey"
						light={true}
						on:click={() => (databases = getDbs())}
					/>Refresh
				</div>
			</div>
		</div>
		<div in:fade={{ duration: 200 }}>
			{#await databases}
				<Svelecte options={[]} placeholder="Loading..." disabled={true} />
			{:then dbs}
				{#key dbs}
					<Svelecte
						options={dbs}
						renderer="dbSelect"
						bind:value={flowData.defaultDatabase}
						placeholder="Select a database"
						searchable={true}
						valueAsObject={true}
						clearable={true}
					/>
				{/key}
			{/await}
		</div>
	</div>
	{#if flowData.defaultDatabase}
		{#await databases}
			<div class="waiting loading" in:fade={{ duration: 200, delay: 200 }}>
				<div class="title">Loading...</div>
			</div>
		{:then dbs}
			{#key props}
				<Props options={props} />
			{/key}
		{/await}
	{:else}
		<div class="waiting" in:fade={{ duration: 200, delay: 200 }}>
			<div class="title">No database selected</div>
			<div class="subtitle">Select a database to view its properties.</div>
		</div>
	{/if}
	<div class="flow-footer">
		<Button
			value="Capture"
			style="primary"
			size="big"
			color="blue"
			icon="inbox"
			iconPosition="right"
		/>
	</div>
	{#if confirmDelete}
		<div
			class="delete-modal"
			in:fade={{ duration: 200 }}
			out:fade={{ duration: 200 }}
		>
			<div class="delete-modal-content">
				<h3>Are you sure?</h3>
				<div class="delete-modal-buttons">
					<Button
						value="Cancel"
						style="outline"
						size="med"
						on:click={() => (confirmDelete = false)}
					/>
					<Button
						value="Delete"
						color="red"
						size="med"
						on:click={() => deleteCurrentFlow()}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@use "../style/global" as *;

	:global(.sv-control) {
		border: none;
	}
	.flow-page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		width: 100%;
		background: var(--bg-darkish);
		height: 600px;
		.database-select {
			padding: 0 0.75rem 0.75rem 0.75rem;
			background-color: var(--bg-dark);
			border-bottom: 1px solid var(--border-color);
			box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.03) ;
			z-index: 11;
		}
		.waiting {
			@include flex(column, center, center);
			@include ui-text(var(--text-light), 1rem, 600);
			height: 100%;
			width: 100%;
			.title {
				@include ui-text(var(--text-light), 1rem, 600);
				margin-bottom: 0.5rem;
			}
			.subtitle {
				@include ui-text(var(--text-light), 1rem, 400);
			}
			&.loading {
				@include pulse();
			}
		}
	}
	.flow-footer {
		@include flex(row, center, center);
		padding: 0.5rem;
		background: var(--bg-darker);
		color: var(--white);
		font-size: 0.815rem;
		font-weight: 600;
		margin: auto 0 0 0;
		cursor: pointer;
		transition: 0.2s ease;
		box-shadow: 0 -10px 20px 0 rgba(0, 0, 0, 0.06) ;
		z-index: 11;
		border-top: 1px solid var(--border-color);


		&:hover {
			filter: brightness(1.1);
		}
	}
	.input-label {
		@include flex(row, flex-start, center);
		margin: 0 0 0.25rem 0.175rem;
		> h3 {
			@include h3();
			flex-grow: 1;
		}
		.options-handle {
			@include flex(row, center, center);
			border-radius: 0.25rem;
			padding: 0.25rem;
			cursor: pointer;
			background: var(--bg);
			border: 1px solid transparent;
			transition: 0.2s ease;
			&:hover {
				background: rgba(0, 0, 0, 0.05);
			}
			&.loading {
				cursor: not-allowed;
				pointer-events: none;
			}
			&.refresh {
				background: var(--bg-dark);
				&:hover {
					background: var(--bg-darker);
				}
			}
			.refresh-text {
				@include ui-text-small();
				@include flex(row, center, center);
				pointer-events: none;
			}
		}
	}
	.flow-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		column-gap: 0.25rem;
		position: relative;
		padding: 0.75rem 0.75rem 1.25rem 0.75rem;
		margin: 0;
		background: var(--bg-dark);

		> h2 {
			margin: 0 auto 0 0;
			padding: 0;
			height: 1.5rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-grow: 1;
			> input {
				font-size: 1rem;
				font-weight: 600;
				color: var(--text-dark);
				padding: 0 0 0 0.25rem;
				margin: 0 0 1px 0;
				width: 100%;
				border: 1px solid transparent;
				height: 1.5rem;
				max-height: 1.5rem;
				transition: 200ms;
				cursor: text;
				border-radius: 0.25rem;
				background: var(--bg-dark);
				&:focus {
					outline: none;
					background-color: var(--bg);
					box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.04);
				}
				&:hover {
					background-color: var(--bg);
				}
			}
		}
		.flow-settings {
			position: absolute;
			top: 2.25rem;
			right: 1rem;
			z-index: 999;
		}
	}

	.delete-modal {
		position: fixed;
		top: -2rem;
		left: 0;
		width: 100%;
		height: calc(100% + 2rem);
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(2px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		overflow: visible;
		z-index: 20;
		.delete-modal-content {
			background-color: var(--bg);
			padding: 1.5rem;
			border-radius: 4px;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			row-gap: 0.5rem;
			box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
			> h3 {
				@include h3();
				margin-bottom: 16px;
			}
			.delete-modal-buttons {
				display: flex;
				flex-direction: row;
				column-gap: 8px;
			}
		}
	}
</style>
