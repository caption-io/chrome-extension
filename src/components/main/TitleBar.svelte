<script lang="ts">
	import Icon from "../ui/Icon.svelte";
	import { appExpanded } from "src/scripts/platform/stores";
	import Button from "src/components/ui/Button.svelte";

	function close() {
		browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
			browser.tabs.sendMessage(tabs[0].id, "togglePopup");
		});
	}
</script>

<div class="main">
	<div class="window-bar">
		<div class="window-title">
			<div class="logo-icon">
				<Icon
					name="quoteOpen"
					size={22}
					color="blue-400"
					position="m"
				/>
			</div>
			Caption
		</div>
		<div class="window-controls">
				<Button
					icon="popout"
					size="sm"
					style="minimal"
					color="blue"
				/>
				<Button
					icon="{$appExpanded ? "collapse" : "expand"}"
					size="sm"
					style="minimal"
					color="blue"
					on:click={() => ($appExpanded = !$appExpanded)}
				/>
			<Button
				icon="close"
				size="sm"
				style="minimal"
				color="red"
				on:click={close}
			/>
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

	.main {
		background-color: var(--gray-50);
		width: 100%;
		box-sizing: border-box;
		.window-bar {
			@include flex(row, space-between, center);
			@include ui-text(var(--text-light), 0.875rem, 500);
			width: 100%;
			height: $p48;
			padding: 0 0.75rem;
			box-sizing: border-box;
			border-bottom: $border-light;
			.window-title {
				@include flex(row, flex-start, center);
				@include ui-text(var(--blue-400), $p12, 700);
				text-transform: uppercase;
				width: 100%;
				.logo-icon {
					margin-top: 0.2px;
				}
			}
			.window-controls {
				@include flex(row, flex-end, center);
				@include ui-text(var(--text-300), 0.875rem, 500);
				width: 100%;
				box-sizing: border-box;
				column-gap: 0.25rem;
				.hidden {
					@include flex(row, flex-end, center);
					column-gap: 0.25rem;
					opacity: 0.25;
					transition: 200ms ease;
					transform: translateY(-2.25rem);
				}
			}
			&:hover .hidden {
				opacity: 1;
				transform: translateY(0);
			}
		}
		.tab-container {
			@include flex(row, flex-start, center);
			column-gap: 0.5rem;
			height: 64px;

			.tab {
				@include flex(column, center, center);
				padding: 0.5rem;
				box-sizing: border-box;
				cursor: pointer;
				flex-grow: 1;
				border-radius: 0.5rem;
				transition: 300ms ease;
				&:hover {
					filter: brightness(1.05);
				}
				.tab-label {
					@include ui-text(var(--text-dark), 0.875rem, 500);
					padding-top: 0.25rem;
					transition: 300ms ease;
				}
			}
		}
	}
</style>
