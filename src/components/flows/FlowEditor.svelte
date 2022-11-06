<script lang="ts">
	// IMPT: Components
	import Icon from "src/components/ui/Icon.svelte";
	import Button from "src/components/ui/Button.svelte";
	import Props from "./Props.svelte";
	import Select from "src/components/ui/select/Select.svelte";
	import FlowSettings from "./FlowSettings.svelte";

	// IMPT: Local
	import { GetAllDatabases } from "src/scripts/output-providers/notion/get";
	import {
		selectedFlow,
		activeAccount,
		maxSize,
		accountStore,
	} from "src/scripts/platform/stores";
	import { _flows, _settings } from "src/scripts/platform/platform";
	import { fade, fly } from "svelte/transition";

	// IMPT: Packages
	import { createEventDispatcher } from "svelte";
	import { update } from "lodash-es";
	import SaveButton from "./SaveButton.svelte";

	// VARS: Variable Setter Functions
	const dispatch = createEventDispatcher();

	// VARS: Props
	export let flow: Flow;

	// VARS: Local
	let showSettings: boolean = false;
	let confirmDelete: boolean = false;
	let nameInput: HTMLInputElement;
	let unsavedFlow: Flow = flow;
	let favorite: boolean = false;

	let readSel;

	_settings.load("defaultAccount").then((res) => {
		if (unsavedFlow.defaultAccount) {
			activeAccount.set(unsavedFlow.defaultAccount);
		} else {
			if (typeof res == "string") {
				activeAccount.set(res);
			}
		}
	});
	let databases = getDbs();

	async function getDbs() {
		let acc = await _settings.load("defaultAccount");
		return GetAllDatabases(acc).then((res) => {
			if ($selectedFlow.defaultDestination) {
				for (let r in res) {
					if ($selectedFlow.defaultDestination.id === res[r].id) {
						selectedFlow.set({
							...$selectedFlow,
							defaultDestination: res[r],
						});
					}
				}
			}
			return res;
		});
	}

	function handleAccountChange(acc) {
		databases = null;
		activeAccount.set(acc);
		databases = getDbs();
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
			style:color={favorite ? "var(--red)" : "var(--gray)"}
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
				on:click={() => (showSettings = !showSettings)}
			/>
		</div>
	</div>
	<div
		class="animation-wrapper"
		style:height="100%"
	>
		{#if showSettings}
			<FlowSettings />
		{:else if !showSettings}
			<div
				class="flow-body"
				out:fly={{ duration: 200, x: -400 }}
				in:fly={{ duration: 200, x: -400, delay: 200 }}
			>
				<div class="database-select">
					{#key $activeAccount}
						{#await databases}
							<Select
								options={[]}
								placeholder="Loading..."
								disabled={true}
								value={null}
							/>
						{:then dbs}
							<Select
								options={dbs}
								bind:value={unsavedFlow.defaultDestination}
								placeholder="Select a database"
								searchable={true}
								clearable={true}
								labelField="name"
								valueField="id"
								valueAsObject={true}
								hasIcons={true}
								dropdownRelative={true}
							/>
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
					/>
					<!-- <WebIcon /> -->
				</div>
				{#if unsavedFlow.defaultDestination}
					{#key unsavedFlow.defaultDestination}
						<Props options={unsavedFlow.defaultDestination.props} />
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
	<div class="capture-button">
		<div class="capture-button-icon">
			<Icon
				icon="inbox"
				size={20}
				color="inherit"
			/>
		</div>
		<div class="capture-button-label">
			Capture
		</div>
	</div>
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
			position: absolute;
			bottom: $p12;
			right: $p12;
			width: fit-content;
			height: 44px;
			background: var(--blue);
			border-top: 1px solid var(--border);
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			transition: all 0.2s ease;
			box-sizing: border-box;
			border-radius: 22px;
			color: white;
			box-shadow: 0 2px 8px 0 var(--shadow-color);
			.capture-button-icon {
				padding: 0 $p12;
			}
			.capture-button-label {
				font-size: 14px;
				font-weight: 500;
				color: var(--text);
				width: 0px;
				transition: $transition;
				overflow: hidden;
				padding-left: 8px;
				box-sizing: border-box;
				margin-left: -8px;
				opacity: 0;
			}
			&:hover {
				.capture-button-label {
					@include ui-text(var(--white), $p14, 500);
					width: 78px;
					margin-left: -12px;
					opacity: 1;
				}
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
			margin: $p6 0 0 0;
			box-sizing: border-box;
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
					margin: 0 0 1px 0;
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
				width: $p36;
			}
			.favorite-button {
				@include flex(row, center, center);
				height: $p36;
				width: $p36;
				cursor: pointer;
				transition: $transition;
			}
		}
		.database-select {
			@include flex(row, center, center);
			column-gap: $p12;
			background-color: var(--bg-dark);
			position: relative;
			margin: $p6 $p12;
			box-sizing: border-box;
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
