<script lang="ts">
	import Icon from "../ui/Icon.svelte";
	import Radio from "../ui/Radio.svelte";
	import Toggle from "../ui/Toggle.svelte";
	import Button from "../ui/Button.svelte";
	import { accountStore, settingStore, flowStore, tooltipInfo } from "src/scripts/platform/stores";
	import Select from "../ui/select/Select.svelte";
	import { fly, slide, fade, crossfade } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import {
		_settings,
		_outputProviders,
		_flows
	} from "src/scripts/platform/flows-scripts";
	import { handleE } from "src/scripts/ui-utils";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	let activeTab = "Flows";

	const [send, receive] = crossfade({
		duration: 400,
		easing: quintOut,
	});

	let settingsGroups: { name: string; icon: Icons }[] = [
		{ name: "Flows", icon: "flow" },
		{ name: "Accounts", icon: "account" },
		{ name: "Extension", icon: "plugin" },
	];

	let flyDirection = 400;
	function handleTabClick(newTab) {
		let prevTabIndex = settingsGroups.findIndex((t) => t.name === activeTab);
		let newTabIndex = settingsGroups.findIndex((t) => t.name === newTab);
		flyDirection = prevTabIndex > newTabIndex ? -400 : 400;
		activeTab = newTab;
	}

</script>

<div
	class="caption-settings"
	in:fly={{ duration: 200, x: 400, delay: 200 }}
	out:fly={{ duration: 200, x: -400 }}
>
		<div class="settings-tabs">
			{#each settingsGroups as group, i}
				<div
					class="settings-group-tab"
					class:active={activeTab === group.name}
					on:click={() => handleTabClick(group.name)}
				>
					<Icon
						icon={group.icon}
						color={group.name === activeTab ? "blue" : "gray"}
						size={16}
					/>
					{group.name}
				</div>
			{/each}
		</div>
		{#each settingsGroups as sg (sg.name)}
			{@const settingList = $settingStore.filter((s) => s.group === sg.name)}
			{#if sg.name === activeTab}
				<div
					class="settings-list"
					class:active={activeTab === activeTab}
					in:fly={{ duration: 300, x: flyDirection, opacity: 1 }}
				>
					{#each settingList as setting (setting.id)}
						<div
							class="setting"
							class:radio={setting.type === "radio"}
							class:row={setting.type === "boolean"}
						>
							<div class="label">
								{setting.name}
								{#if setting.description}
									<div
										class="info-icon"
										on:mouseenter={(e) =>
											tooltipInfo.set({
												text: setting.description,
												position: "bottom-right",
												location: {
													x: handleE(e.target).getBoundingClientRect().left,
													y: handleE(e.target).getBoundingClientRect().top + 24,
												},
											})}
										on:mouseleave={() => (tooltipInfo.set(null))}
									>
										<Icon
											icon="info"
											size={12}
											color="gray"
										/>
									</div>
								{/if}
							</div>
							<div class="value">
								{#if setting.type === "select"}
									<Select
										options={setting.options === "flows"
											? $flowStore
											: setting.options === "accounts"
											? $accountStore
											: setting.options}
										value={setting.value}
										clearable={setting.options === "flows" ? true : false}
										on:select={(e) => {
											console.log(e.detail);
										}}
										hasIcons={setting.options === "accounts"
											? true
											: false}
									/>
								{:else if setting.type === "radio"}
									<Radio
										options={setting.options}
										value={setting.value}
										on:change={(e) => {
											_settings.save(setting.id, e.target.value);
										}}
									/>
								{:else if setting.type === "boolean"}
									<Toggle
										value={setting.value}
										type="switch"
									/>
								{/if}
							</div>
						</div>
					{/each}
					{#if sg.name === "Accounts"}
						<div class="button-box">
							<Button
								on:click={() => _outputProviders.addAccount()}
								text="Add Workspace"
								icon="accountAdd"
								style="primary"
								color="blue"
								fill={true}
							/>
							<Button
								on:click
								text="Delete Data"
								icon="trash"
								style="outline-fill"
								color="red"
								fill={true}
							/>
						</div>
					{/if}
				</div>
			{/if}
		{/each}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	.caption-settings {
		display: flex;
		flex-direction: column;
		gap: $p12;
		padding: 0 0 $p24 0;
		width: 100%;
		:not(:first-child).header {
			border-top: $border-light;
		}
		.settings-tabs {
			@include flex(row, center, center);
			width: 100%;
			box-sizing: border-box;
			transition: $transition;
			background-color: var(--bg);
			overflow: hidden;
			min-height: $p42;

			.settings-group-tab {
				@include flex(row, center, center);
				@include ui-text(var(--text-tertiary), $p14, 500);
				column-gap: $p6;
				padding: $p12 $p12 $p12 $p12;
				transition: $transition;
				width: 100%;
				box-sizing: border-box;
				cursor: pointer;
				background-color: var(--bg-tertiary);
				z-index: 1;
				height: $p42;

				&.active {
					@include ui-text(var(--blue-400), $p14, 500);
					background-color: var(--bg);
					box-shadow: 0 0 $p12 0 var(--shadow-color);
					z-index: 2;
				}
				&:hover:not(.active) {
					background-color: var(--bg-secondary);
				}
			}
		}
		.settings-list {
			@include flex(column, flex-start, center);
			width: 100%;
			height: 100%;
			transform: translateX(-100%);
			box-sizing: border-box;
			&.active {
				transform: translateX(0);
			}
			.button-box {
				@include flex(row, flex-start, center);
				width: 100%;
				column-gap: $p12;
				padding: $p12;
				box-sizing: border-box;
			}
			.setting {
				@include flex(column, flex-start, center);
				gap: $p12;
				box-sizing: border-box;
				width: 100%;
				position: relative;
				min-height: $p42;
				padding: $p12 $p12;
				border-bottom: 1px solid var(--border-color-secondary);
				&.row {
					flex-direction: row;
				}
				.label {
					@include flex(row, space-between, center);
					@include ui-text(var(--text-primary), $p14, 500);
					width: 100%;
					.info-icon {
						padding-right: $p6;
						opacity: 50%;
					}
				}
				.description {
					@include ui-text(var(--text-secondary), $p12, 400);
					margin-top: $p6;
					transition: $transition;
				}
				.value {
					@include flex(row, flex-end, center);
					width: 100%;
					select {
						width: 100%;
						padding: 0.5rem;
						border: 1px solid var(--color-border);
						border-radius: 0.25rem;
						font-size: 1rem;
						color: var(--color-text-primary);
						background-color: var(--color-background);
						box-sizing: border-box;
						&:focus {
							outline: none;
							border-color: var(--color-primary);
						}
					}
				}
				&.radio {
					@include flex(column, flex-start, flex-start);
					.value {
						width: 100%;
					}
				}
			}
		}
	}
</style>
