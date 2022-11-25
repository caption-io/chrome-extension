<script lang="ts">
	// IMPT: Components
	import Icon from "src/components/ui/Icon.svelte";
	import Button from "src/components/ui/Button.svelte";
	import Props from "../Props.svelte";
	import Select from "src/components/ui/Select.svelte";
	import FlowSettings from "./FlowSettings.svelte";

	// IMPT: Local
	import { GetAllDatabases } from "src/scripts/output-providers/notion/get";
	import {
		selectedFlow,
		activeAccount,
		maxSize,
		accountStore,
		activePage,
	} from "src/scripts/platform/stores";
	import { _flows, _settings } from "src/scripts/platform/platform";
	import { fade, fly } from "svelte/transition";

	// IMPT: Packages
	import { createEventDispatcher } from "svelte";
	import { isMatch, update } from "lodash-es";
	import SaveButton from "../SaveButton.svelte";

	// VARS: Variable Setter Functions
	const dispatch = createEventDispatcher();

	// VARS: Props
	export let flow: Flow;

	// VARS: Local
	let showSettings: boolean = false;
	let confirmDelete: boolean = false;
	let nameInput: HTMLInputElement;
	let unsavedFlow: Flow = $selectedFlow;
	let favorite: boolean = false;
	let unsavedDestination: boolean = false;

	let propValues;

	$: console.log("UNSAVED FLOW:", unsavedFlow)
	$: console.log("PROP VALUES:", propValues)

	if (!unsavedFlow.defaultAccount) {
		_settings.load("defaultAccount").then((res) => {
			if (typeof res == "string") {
				activeAccount.set(res);
				_flows.update(unsavedFlow.id, "defaultAccount", res);
				unsavedFlow.defaultAccount = res;
				return res;
			}
		});
	} else {
		activeAccount.set(unsavedFlow.defaultAccount);
	}
	let databases = getDbs();

	async function getDbs() {
		if (unsavedFlow.defaultAccount) {
			let acc = unsavedFlow.defaultAccount;
			return GetAllDatabases(acc).then((res) => {
				if ($selectedFlow.defaultDestination) {
					for (let r in res) {
						if ($selectedFlow.defaultDestination.id === res[r].id) {
							selectedFlow.set({
								...$selectedFlow,
								defaultDestination: $selectedFlow.defaultDestination,
							});
						}
					}
				}
				return res;
			});
		}
	}

	function handleDestinationChange(db) {
		if (
			(!unsavedFlow.defaultDestination && db) ||
			$selectedFlow.defaultDestination.id !== db.id
		) {
			unsavedDestination = true;
			unsavedFlow.defaultDestination = db;
		} else if ($selectedFlow.defaultDestination.id === db.id) {
			unsavedDestination = false;
		} else {
			console.error("Something went wrong with the destination change handler");
		}
		selectedFlow.set({
			...$selectedFlow,
			defaultDestination: {
				...$selectedFlow.defaultDestination,
				defaultSort: false
			},
		});
	}

	function handleAccountChange(acc) {
		databases = null;
		activeAccount.set(acc);
		databases = getDbs();
	}

	function saveDefaultDestination() {
		unsavedDestination = false;
		_flows.update(
			flow.id,
			"defaultDestination",
			unsavedFlow.defaultDestination
		);
		selectedFlow.set({
			...$selectedFlow,
			defaultDestination: $selectedFlow.defaultDestination,
		});
	}
</script>

<div
	class="flow-page"
	style="max-height: {$maxSize.height - 48}px;"
>
	<div class="flow-header">
		<h2>
			<input
				type="text"
				bind:this={nameInput}
				bind:value={unsavedFlow.name}
				on:keydown={(e) =>
					e.key == "Enter"
						? _flows.update(flow.id, "name", e.target.value)
						: null}
				on:click={() => nameInput.select()}
			/>
		</h2>
		<div
			class="favorite-button"
			class:favorited={favorite}
			on:click={() => (favorite = !favorite)}
		>
			<Icon
				icon="favorite"
				size={16}
				color="inherit"
			/>
		</div>
		<div class="settings-button">
			<Button
				icon="cog"
				size="sm"
				color="blue"
				style="minimal"
				on:click={() => activePage.set("flowSettings")}
			/>
		</div>
	</div>
	<div
		class="animation-wrapper"
		style:height="100%"
	>
		{#if $activePage === "flowSettings"}
			<FlowSettings flow={$selectedFlow.id} />
		{:else}
			<div
				class="flow-body"
				out:fly={{ duration: 200, x: -400 }}
				in:fly={{ duration: 200, x: -400, delay: 200 }}
			>
				<div class="database-select">
					{#key $activeAccount}
						{#await databases} 
							<Select
								placeholder="Loading..."
								disabled={true}
								/>
						{:then dbs}
							<Select
								options={dbs}
								value={unsavedFlow.defaultDestination}
								placeholder="Select a database"
								searchable={true}
								clearable={false}
								labelField="name"
								valueField="id"
								valueAsObject={true}
								hasIcons={true}
								dropdownRelative={true}
								on:valuechange={(e) => handleDestinationChange(e.detail)}
							>
								<div
									class="save-button-container"
									slot="badge"
									class:show={unsavedDestination}
									transition:fade={{ duration: 200 }}
									on:click={(e) => {
										e.stopPropagation();
										unsavedDestination = false;
										_flows.update(
											flow.id,
											"defaultDestination",
											unsavedFlow.defaultDestination
										);
									}}
								>
									<div
										class="save-button"
										on:click={(e) => {
											saveDefaultDestination();
										}}
									>
										<Icon
											icon="save"
											size={12}
											color="inherit"
										/>
									</div>
								</div>
							</Select>
						{/await}
					{/key}
					<Select
						options={$accountStore}
						value={$activeAccount}
						searchable={false}
						clearable={false}
						placeholderIcon="author"
						noFill={true}
						dropdownRelative={true}
						hasIcons={true}
						minimalControl={true}
						valueAsObject={false}
						on:valuechange={(e) => {
							handleAccountChange(e.detail);
						}}
					>
						<div
							class="add-account-button"
							slot="no-options"
						>
							No other accounts.
							<Button
								text="Add Account"
								icon="accountAdd"
								style="primary"
								color="blue"
								size="md"
							/>
						</div>
					</Select>
					<!-- <WebIcon /> -->
				</div>
				{#if unsavedFlow.defaultDestination}
					{#key unsavedFlow.defaultDestination}
						<Props options={unsavedFlow.defaultDestination.props} on:propvaluechange={(e) => propValues = e.detail} />
						<!-- <div style="padding: 48px 12px;">
							Props for {unsavedFlow.defaultDestination.name}
						</div> -->
					{/key}
				{:else}
					<div class="no-db">
						<Icon
							icon="database"
							size={24}
							color="gray"
						/>
						<div class="title">No database selected</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
	{#if $activePage !== "flowSettings"}
		<div class="capture-button">
			<div class="capture-button-icon">
				<Icon
					icon="inbox"
					size={20}
					color="inherit"
				/>
			</div>
			<div class="capture-button-label">Capture</div>
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
		overflow: visible;
		position: relative;
		.capture-button {
			width: 100%;
			height: 64px;
			background: var(--blue);
			border-top: 1px solid var(--border);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: all 0.2s ease;
			box-sizing: border-box;
			color: white;
			box-shadow: 0 2px 8px 0 var(--shadow-color);
			z-index: 0;
			gap: $p8;
			.capture-button-icon {
			}
			.capture-button-label {
				font-size: 14px;
				font-weight: 500;
				color: var(--white);
				transition: $transition;
				overflow: hidden;
				box-sizing: border-box;
			}
		}
		.animation-wrapper {
			@include flex(row, flex-start, flex-start);
			width: 100%;
		}
		.flow-body {
			position: relative;
			width: 100%;
			height: 100%;
		}
		.flow-header {
			@include flex(row, flex-start, center);
			width: 100%;
			padding-left: $p12;
			padding-right: $p12;
			margin: $p6 0 $p6 0;
			box-sizing: border-box;
			gap: $p6;
			> h2 {
				margin: 0;
				padding: 0;
				height: 2.25rem;
				display: flex;
				flex-direction: row;
				align-items: center;
				flex-grow: 1;
				border-radius: $border-radius;
				overflow: hidden;
				> input {
					@include ui-text(var(--text), 1rem, 600);
					margin: 1px 0 0 0;
					width: 100%;
					height: 100%;
					transition: 200ms;
					cursor: text;
					border: none;
					outline: none;
					background-color: var(--bg);
					padding-left: $p12;
					box-sizing: border-box;
					&:focus {
						outline: none;
						background-color: var(--bg-secondary);
						box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.04);
					}
					&:hover {
						background-color: var(--bg-secondary);
					}
				}
			}
			.settings-button {
				@include flex(row, flex-end, center);
				width: $p24;
			}
			.favorite-button {
				@include flex(row, center, center);
				height: $p24;
				width: $p24;
				cursor: pointer;
				transition: $transition;
				color: var(--text-secondary);
				border-radius: $p3;
				&.favorited {
					color: var(--red);
				}
				&:hover {
					background-color: var(--gray-light);
					&.favorited {
						background-color: var(--red-light);
					}
				}
			}
		}
		.database-select {
			@include flex(row, center, center);
			column-gap: $p12;
			background-color: var(--bg-dark);
			position: relative;
			margin: $p6 $p12 $p12;
			box-sizing: border-box;
			.save-button-container {
				z-index: 10;
				display: none;
				.save-button {
					@include flex(row, center, center);
					padding: 0 $p4;
					height: $p20;
					border-radius: $p4;
					transition: $transition;
					cursor: pointer;
					box-sizing: border-box;
					z-index: 0;
					color: var(--gray);
					background-color: var(--bg-tertiary);
					margin-left: $p3;
					&:hover {
						background-color: var(--blue-light);
						color: var(--blue);
					}
				}
				&.show {
					display: flex;
				}
			}
		}
		.add-account-button {
			@include flex(column, center, center);
			@include ui-text(var(--text-secondary), $p14, 500);
			row-gap: $p12;
			padding: $p6 $p12;
		}
		.no-db {
			@include flex(column, center, center);
			@include ui-text(var(--text-light), 1rem, 600);
			height: 374px;
			width: 100%;
			box-sizing: border-box;
			.title {
				@include ui-text(var(--text-tertiary), $p18, 600);
				margin: $p6;
			}
			.subtitle {
				@include ui-text(var(--text-tertiary), $p14, 500);
			}
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
