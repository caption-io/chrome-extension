<script lang="ts">
	import Select from "src/components/ui/select/Select.svelte";
	import { fly } from "svelte/transition";
	import Svelecte from "svelecte";
	import { selectedFlow } from "src/scripts/platform/stores";
	import { _flows } from "src/scripts/platform/platform";
	import Icon from "../ui/Icon.svelte";
	import Toggle from "../ui/Toggle.svelte";
	let tags = $selectedFlow.tags;
</script>

<div
	id="flow-settings"
	class="main"
	in:fly={{ duration: 200, x: 400, delay: 200 }}
	out:fly={{ duration: 200, x: 400 }}
>
	<div class="setting">
		<div class="setting-label">Tags</div>
		<Select
			options={[
				{ name: "articles", id: "articles" },
				{ name: "videos", id: "videos" },
				{ name: "images", id: "images" },
				{ name: "tweets", id: "tweets" },
				{ name: "other", id: "other" },
			]}
			multiple={true}
			fieldIcon="tag"
			itemStyle="select"
		/>
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
		<Select
			options={[
				{ name: "Open", id: "Open" },
				{ name: "Instant Capture", id: "Instant Capture" },
			]}
			value="Open"
		/>
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
		padding: 0;
		box-sizing: border-box;
		.setting {
			@include flex(column, flex-start, flex-start);
			padding: $p24 $p24;
			&:not(:last-child) {
				border-bottom: 1px solid var(--border-color-secondary);
			}
			&:first-child {
				border-top: 1px solid var(--border-color-secondary);
			}

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
				align-items: center;
				.key {
					@include ui-text(var(--text-secondary), $p12, 500);
					padding: $p4 $p8;
					border-radius: $p4;
					background-color: var(--bg-secondary);
					margin: 0 $p4;
					&.ctrl {
						background-color: var(--bg-secondary);
					}
					&.shift {
						background-color: var(--bg-secondary);
					}
				}
				.key-input {
					color: var(--text);
					padding: $p4 $p8;
					border-radius: $p4;
					background-color: var(--bg);
					border: 1px solid var(--border-color);
					margin-left: $p4;
				}
			}
		}
	}
</style>
