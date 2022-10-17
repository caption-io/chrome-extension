<script lang="ts">
	// IMPT: Components
	import Icon from "src/components/ui/Icon.svelte";
	import Button from "src/components/ui/Button.svelte";
	import Props from "./Props.svelte";
	import Select from "src/components/ui/select/Select.svelte";
	import FlowSettings from "./FlowSettings.svelte";
	import WebIcon from "../ui/WebIcon.svelte";

	// IMPT: Local
	import { GetAllDatabases } from "src/scripts/output_providers/notion";
	import { selectedFlow } from "src/scripts/platform/stores";
	import {
		updateFlow,
		updateFlowName,
		updateFlowTags,
	} from "src/scripts/platform/chrome-storage";
	import { deleteFlow } from "src/scripts/platform/flows-scripts";
	import { clickAnimation } from "src/scripts/ui-utils";
	import { fade } from "svelte/transition";

	// IMPT: Packages
	import { createEventDispatcher } from "svelte";
	import { isEqual } from "lodash-es";

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
</script>

<div class="flow-page">
	<div class="flow-header">
		<Button
			icon="back"
			style="secondary"
			color="gray"
			size="sm"
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
				text="Save Changes"
				style="outline"
				size="sm"
				on:click={saveChanges}
			/>
		{/if}
		<Button
			icon="cog"
			style="minimal"
			color="blue"
			size="sm"
			on:click={() => (showSettings = !showSettings)}
		/>
	</div>
	{#if showSettings}
		<FlowSettings />
	{/if}
	<div class="database-select">
		<div in:fade={{ duration: 200 }}>
			{#await databases}
				<Select
					options={[]}
					placeholder="Loading..."
					disabled={true}
					type="databases"
					value={null}
					labelIcon="database"
					label="Database"
				/>
			{:then dbs}
				{#key dbs}
					<Select
						options={dbs}
						bind:value={flowData.defaultDatabase}
						placeholder="Select a database"
						searchable={true}
						valueAsObject={true}
						clearable={true}
						label="Database"
						labelIcon="database"
						type="databases"
					/>
				{/key}
			{/await}
		</div>
		<WebIcon />

	</div>

	{#if flowData.defaultDatabase}
		{#await databases}
			{#each props as prop}
			<div
			class="waiting loading"
			in:fade={{ duration: 200, delay: 200 }}
		>
			<Icon
				name="database"
				size={48}
				color="gray-300"
			/>
			<div class="title">Loading</div>
			<div class="subtitle">Fetching DBs from Notion, please wait.</div>
		</div>
			{/each}
		{:then dbs}
			{#key props}
				<Props options={props} />
			{/key}
		{/await}
	{:else}
		<div
			class="waiting"
			in:fade={{ duration: 200, delay: 200 }}
		>
			<Icon
				name="database"
				size={48}
				color="gray-300"
			/>
			<div class="title">No database selected</div>
			<div class="subtitle">Select a database to view its properties.</div>
		</div>
	{/if}
	<div class="flow-footer">
		<Button
			text="Capture"
			icon="inbox"
			style="primary"
			size="md"
			color="blue"
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
						text="cancel"
						style="outline"
						size="md"
						on:click={() => (confirmDelete = false)}
					/>
					<Button
						text="delete"
						icon="trash"
						color="red"
						size="md"
						on:click={() => deleteCurrentFlow()}
					/>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	:global(.sv-control) {
		border: none;
	}
	.flow-page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		width: 100%;
		background: var(--bg);
		height: 100%;
		overflow: hidden;
		.database-select {
			padding: 0 0.75rem 0.75rem 0.75rem;
			background-color: var(--bg-dark);
			z-index: 11;
			margin-bottom: $p12;
		}
		.waiting {
			@include flex(column, center, center);
			@include ui-text(var(--text-light), 1rem, 600);
			height: 100%;
			width: 100%;
			padding: 2rem 1rem;
			box-sizing: border-box;
			.title {
				@include ui-text(var(--gray-400), $p18, 600);
				margin: $p16 $p16 $p16 $p16;
			}
			.subtitle {
				@include ui-text(var(--gray-300), $p14, 500);
			}
			&.loading {
				@include pulse();
				@include flex(column, flex-start, flex-start);
				margin: 0.5rem 0.5rem;
				padding: 0 0 0 0.5rem;
				.loading-label {
					@include flex(row, flex-start, center);

					.loading-icon {
						height: 1rem;
						width: 1rem;
						border-radius: var(--border-radius);
						background-color: var(--bg-darker);
						margin-right: 0.25rem;
					}
					.loading-title {
						height: 1rem;
						width: 6rem;
						border-radius: var(--border-radius);
						background-color: var(--bg-darker);
					}
				}
				.loading-input {
					height: 2.25rem;
					width: 10rem;
					border-radius: var(--border-radius);
					background-color: var(--bg-darker);
					margin-top: 0.5rem;
				}
			}
		}
	}
	.flow-footer {
		@include flex(row, center, center);
		padding: 0.75rem 1rem;
		color: var(--white);
		font-size: 0.815rem;
		font-weight: 600;
		margin: auto 0 0 0;
		cursor: pointer;
		transition: 0.2s ease;
		box-shadow: 0 -10px 20px 0 rgba(0, 0, 0, 0.06);
		z-index: 11;
		border-top: 1px solid var(--grey-300);
		background-color: var(--grey-50);

		&:hover {
			filter: brightness(1.1);
		}
	}
	.input-label {
		@include flex(row, flex-start, center);
		margin: 0 0 0.25rem 0.175rem;
		> h3 {
			@include ui-text(var(--text), 1rem, 600);
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
				@include ui-text(var(--text), 0.75rem, 600);

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
		padding: $p12;
		margin: 0;
		background: var(--bg);

		> h2 {
			margin: 0 auto 0 0;
			padding: 0 0 0 0.25rem;
			height: 1.5rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			flex-grow: 1;
			border-radius: $border-radius;
			overflow: hidden;
			background: var(--bg);
			&:hover {
				background: var(--bg-tertiary);
			}

			> input {
				@include ui-text(var(--text), 1rem, 600);
				margin: 0 0 1px 0;
				width: 100%;
				height: 100%;
				transition: 200ms;
				cursor: text;
				border: none;
				outline: none;
				&:focus {
					outline: none;
					background-color: var(--bg-tertiary);
					box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.04);
				}
				&:hover {
					background-color: var(--bg-tertiary);
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
				@include ui-text(var(--text), 1rem, 600);
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
