<script lang="ts">
	import Select from "src/components/ui/Select.svelte";
	import { fly, slide } from "svelte/transition";
	import Svelecte from "svelecte";
	import {
		selectedFlow,
		tagStore,
		flowStore,
	} from "src/scripts/platform/stores";
	import { _flows, _tags } from "src/scripts/platform/platform";
	import Icon from "../../ui/Icon.svelte";
	import Toggle from "../../ui/Boolean.svelte";
	import { find } from "lodash-es";
	import Button from "src/components/ui/Button.svelte";
	import { text } from "svelte/internal";

	export let flow;

	let selectedTags = $selectedFlow.tags;
	let currentOptions = $tagStore;
</script>

<div
	id="flow-settings"
	class="main"
	in:fly={{ duration: 200, x: 400, delay: 200 }}
	out:fly={{ duration: 200, x: -400 }}
>
	<div class="setting">
		<div class="setting-label">Tags</div>
		<Select
			options={currentOptions}
			value={selectedTags}
			multiple={true}
			fieldIcon="tag"
			itemStyle="select"
			searchable={true}
			createable={true}
			prefix="#"
			on:optionschange={(e) => {
				_tags.update(e.detail);
			}}
			on:valuechange={(e) => {
				_flows.update($selectedFlow.id, "tags", e.detail).then(() => {
					selectedFlow.update((flow) => {
						flow.tags = e.detail;
						return flow;
					});
				});
			}}
		>
			<div
				slot="no-options"
				class="no-tags"
				in:slide={{ duration: 200 }}
			>
				No more tags. Type to add one.
			</div>
		</Select>
	</div>
	<div class="setting row">
		<div class="setting-label">Flow Type</div>
		<div class="setting-value">
			{#if $selectedFlow.type === "inputCapture"}
				<Button
					icon="rename"
					color="gray"
					style="secondary"
					fill={true}
				/>
			{/if}
			<Select
				options={[
					{
						name: "Web Capture",
						id: "inputCapture",
					},
					{
						name: "Quick Add",
						id: "quickAdd",
					},
				]}
				value={$selectedFlow.type}
				clearable={false}
				small={true}
				dropdownRelative={true}
				on:valuechange={(e) => {
					_flows.update($selectedFlow.id, "type", e.detail);
					selectedFlow.update((flow) => {
						flow.type = e.detail;
						return flow;
					});
				}}
			/>
		</div>
	</div>
	<div class="setting row">
		<div class="setting-label">Shortcut</div>
		<div class="setting-value">
			<div class="key ctrl">CTRL / ⌘</div>
			<Icon
				icon="add"
				size={14}
				color="gray"
			/>
			<div class="key shift">SHIFT</div>
			<Icon
				icon="add"
				size={14}
				color="gray"
			/>
			<div class="key-input">Num 5</div>
		</div>
	</div>
	<div class="setting">
		<div class="setting-label">Shortcut Behavior</div>
		<!-- <Select
			options={[
				{ name: "Open", id: "Open" },
				{ name: "Instant Capture", id: "Instant Capture" },
			]}
			value="Open"
		/> -->
	</div>
	<div class="setting row">
		<div class="setting-label">Auto-Capture</div>
		<Toggle />
	</div>
</div>

<style lang="scss">
	@use "src/style/global" as *;
	.main {
		width: 100%;
		padding: 0 $p24;
		box-sizing: border-box;
		border-top: 1px solid var(--border-color-secondary);
		.setting {
			@include flex(column, flex-start, flex-start);
			padding: $p24 0;
			position: relative;
			// &:not(:last-child) {
			// 	border-bottom: 1px solid var(--border-color-secondary);
			// }
			// &:first-child {
			// 	border-top: 1px solid var(--border-color-secondary);
			// }

			.setting-label {
				@include ui-text(var(--text), $p14, 500);
				margin-bottom: $p8;
			}
			&.row {
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.setting-label {
					margin-bottom: 0;
				}
			}
			.setting-value {
				display: flex;
				flex-direction: row;
				gap: $p6;
				align-items: center;
				.key {
					@include ui-text(var(--text-secondary), $p12, 500);
					padding: $p4 $p8;
					border-radius: $p4;
					background-color: var(--bg-quaternary);
					margin: 0 $p4;
					border: 1px solid var(--border-color-secondary);
					&.ctrl {
					}
					&.shift {
					}
				}
				.key-input {
					color: var(--text);
					padding: $p4 $p8;
					border-radius: $p4;
					background-color: var(--bg-secondary);
					border: 1px solid var(--border-color-light);
					margin-left: $p4;
				}
			}
			.no-tags {
				@include flex(column, center, center);
				@include ui-text(var(--text-secondary), $p12, 500);
				padding: $p4 $p8;
			}
		}
	}
</style>
