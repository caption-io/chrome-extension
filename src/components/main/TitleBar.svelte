<script lang="ts">
	import Icon from "../ui/Icon.svelte";
	import {
		appExpanded,
		activePage,
		selectedFlow,
		minimized,
	} from "src/scripts/platform/stores";
	import Button from "src/components/ui/Button.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	function close() {
		chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, "togglePopup");
		});
		minimized.set(false);
	}
</script>

<div class="titlebar-container">
	<div class="window-bar">
		<div
			class="goBack"
			on:click={() => dispatch("close")}
		>
			{#if $selectedFlow !== null || $activePage !== "flows"}
				{#if $minimized === false && $appExpanded === false}
					<Button
						text="Back "
						icon="back"
						color="blue"
						size="md"
						style="minimal"
						on:click={() => {
							if ($selectedFlow && $activePage === "flowSettings") {
								activePage.set("flow");
							} else if ($selectedFlow) {
								selectedFlow.set(null);
								activePage.set("flows");
							} else {
								activePage.set("flows");
							}
						}}
					/>
				{/if}
			{/if}
		</div>
		<div class="window-title">
			<div class="logo-icon" />
			Caption
		</div>
		<div class="window-controls">
			{#if $minimized === false}
				<div class="window-control hidden">
					<Button
						icon="popout"
						size="sm"
						style="minimal"
						color="blue"
					/>
				</div>
				<div class="window-control hidden">
					<Button
						icon={$appExpanded ? "collapse" : "expand"}
						size="sm"
						style="minimal"
						color="blue"
						on:click={() => ($appExpanded = !$appExpanded)}
					/>
				</div>
				<div class="window-control">
					<Button
						icon="minimize"
						size="sm"
						style="minimal"
						color="blue"
						on:click={() => minimized.set(true)}
					/>
				</div>
			{:else if $minimized === true}
				<div class="window-control">
					<Button
						icon="maximize"
						size="sm"
						style="minimal"
						color="blue"
						on:click={() => minimized.set(false)}
					/>
				</div>
			{/if}
			<div class="window-control">
				<Button
					icon="close"
					size="sm"
					style="minimal"
					color="red"
					on:click={close}
				/>
			</div>
		</div>
	</div>
	<!-- <div class="tab-container">
		<div class="tab flow-tab">
			<Icon name="flowPlus" color="grey" size="big" />
			<div class="tab-label">Flows</div>
		</div>
		<div class="tab other-tab">
			<Icon name="zap" color="grey" size="big" />
			<div class="tab-label">Other</div>
		</div>
		<div class="tab more-tab">
			<Icon name="sliders" color="grey" size="big" />
			<div class="tab-label">Options</div>
		</div>
		<div class="tab settings-tab">
			<Icon name="cog" color="grey" size="big" />
			<div class="tab-label">Settings</div>
		</div>
	</div> -->
</div>

<style lang="scss">
	@use "src/style/global" as *;

	.titlebar-container {
		background-color: var(--bg-secondary);
		width: 100%;
		box-sizing: border-box;
		z-index: 10;
		.window-bar {
			@include flex(row, center, center);
			height: $p48;
			padding: 0 $p12 0 $p6;
			box-sizing: border-box;
			border-bottom: $border-light;
			.goBack {
				width: 70px;
				margin-right: $p24;
			}
			.window-title {
				@include flex(row, center, center);
				@include ui-text(var(--blue-400), $p12, 700);
				flex-grow: 1;
				text-transform: uppercase;
				.logo-icon {
					margin-top: 0.2px;
				}
			}
			.window-controls {
				@include flex(row, flex-end, center);
				width: 80px;
				box-sizing: border-box;
				column-gap: 0.25rem;
				.window-control.hidden {
					transition: $transition;
					opacity: 0;
				}
				& > .window-control.hidden:first-child {
					transform: translateX(56px);
				}
				& > .window-control.hidden:nth-child(2) {
					transform: translateX(28px);
				}
				&:hover {
					.window-control.hidden {
						opacity: 1;
					}
					& > .window-control.hidden:first-child {
						transform: translateX(0px);
					}
					& > .window-control.hidden:nth-child(2) {
						transform: translateX(0px);
					}
				}
				// &:hover {
				// 	.window-control {
				// 		opacity: 1;
				// 	}
				// 	& > :not(:last-child) {
				// 		transform: translateX(0);
				// 	}
				// }
			}
		}
	}
</style>
