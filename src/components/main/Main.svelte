<!-- SECT: SCRIPT -->
<script lang="ts">
	// IMPTS: Imports

	// IMPT: Packages
	import { fly, fade, slide, crossfade } from "svelte/transition";
	import {quintOut} from "svelte/easing";

	// IMPT: Components
	import Button from "../ui/Button.svelte";
	import FlowEditor from "../flows/flow-editor/FlowEditor.svelte";
	import FlowList from "../flows/flow-list/FlowList.svelte";
	import Settings from "./Settings.svelte";

	// IMPT: Stores
	import {
		appExpanded,
		selectedFlow,
		activePage,
		minimized
	} from "src/scripts/platform/stores";

	// IMPT: Local Scripts
	import { _outputProviders, _flows } from "src/scripts/platform/platform";
  import FlowSettings from "../flows/flow-editor/FlowSettings.svelte";

	//! IMPTS

	// VARIABLES

	let settingsButtons: {
		name: string,
		icon: Icons,
		func: void,
	}[] = [
		{
			name: "Settings",
			icon: "cog",
			func: activePage.set("settings"),
		}
	]

	// VARS: Local State
	let showSettings = false;

	//! VARIABLES

	// FUNCS
	const [send, receive] = crossfade({
		duration: 300,
		easing: quintOut,
	});
	// FUNC: On Mount
	_flows.load();
	_outputProviders.loadProviders();
	activePage.set("flows");


	//! FUNCS
</script>

<!-- !SECT -->

<!-- SECT: MARKUP -->
<div
	class="container"
	class:expanded={$appExpanded}
	style:height={$minimized ? "0px" : "100%"}
>
	{#if (!$selectedFlow && $activePage !== "settings") || ($appExpanded && $activePage !== "settings")}
		<div
			class="main-page"
			class:expanded={$appExpanded}
			in:fly={{ duration: 200, x: -400 }}
		>
			<div class="flow-list-container" out:fly={{duration: 200, x:-400}}>
				<FlowList />
				<div class="settings-option-container">
					<Button
						text="Settings"
						icon="cog"
						color="blue"
						size="md"
						style="minimal"
						on:click={() => activePage.set("settings")}
						fill
					/>
					<Button
						text="Support"
						icon="help"
						color="blue"
						size="md"
						style="minimal"
						on:click
						fill
					/>
					<Button
						text="About"
						icon="info"
						color="blue"
						size="md"
						style="minimal"
						on:click
						fill
					/>
				</div>
			</div>
		</div>
	{/if}
	{#if $activePage === "settings" || ($appExpanded && $activePage === "settings")}

			<Settings />
	{/if}
	{#if $selectedFlow}
		{#key $selectedFlow.id}
			<div
				class="flow-editor"
				class:expanded={$appExpanded}
				in:fly={{ duration: 200, x: 400, delay: 200 }}
				out:fly={{ duration: 200, x: 400 }}
			>
				<FlowEditor flow={$selectedFlow} />
			</div>
		{/key}
	{/if}
</div>
<!-- !SECT -->

<!-- SECT: STYLE -->
<style lang="scss">
	@use "src/style/global" as *;

	@keyframes blurin {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	.container {
		@include flex(row, flex-start, stretch);
		position: relative;
		width: 100%;
		background-color: var(--bg);
		overflow: visible;

		.main-page {
			@include flex(column, flex-start, stretch);
			padding-bottom: $p12;
			box-sizing: border-box;
			transition: $transition;
			position: relative;
			height: 100%;
			&.expanded {
				margin-right: 1px;
				box-shadow: 1px 0 0 0 var(--border-color-secondary);
			}
			.flow-list-container {
				@include flex(column, flex-start, flex-start);
				height: 100%;
				box-sizing: border-box;
				width: 400px
			}
			.settings-option-container {
				@include flex(row, flex-start, center);
				column-gap: $p12;
				background-color: var(--bg);
				width: 100%;
				padding: 0 $p12;
				box-sizing: border-box;
				.settings-option {
					@include flex(row, center, center);
					@include ui-text(var(--gray-500), 0.875rem, 600);
					width: 100%;
					height: 40px;
					padding: 0 $p12;
					cursor: pointer;
					transition: $transition;
					box-sizing: border-box;
					border-radius: $border-radius;
					&:hover {
						background-color: var(--bg-tertiary);
					}
					.icon {
						margin-right: $p8;
					}
				}
			}
		}
		.flow-editor {
			@include flex(column, flex-start, stretch);
			width: 100%;
			&.expanded {
				height: 100%;
			}
		}
	}

	.handle {
		border-radius: 0.3rem;
		&:hover {
			background: var(--bg-darker);
		}
	}

	.options-container {
		display: flex;
		flex-direction: row;
		column-gap: 8px;
		padding: 0.75rem 1rem;
		background: var(--bg-500);
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid var(--border-color-light);
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.04) inset;
	}

	.no-flows {
		flex-grow: 1;
		font-size: 1rem;
		font-weight: 600;
		min-height: 4rem;
		width: 100%;
		color: var(--grey-600);
		@include flex(row, center, center);
	}
	.expanded {
		height: 100%;
	}
</style>
