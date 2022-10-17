<script lang="ts">
	import Svelecte, { addFormatter } from "svelecte";
	import { webData } from "src/scripts/platform/stores";
	import { forEach } from "lodash-es";
	import { icons } from "../../icons";
	import Icon from "./Icon.svelte";
	import WebDataDropdownItem from "./WebDataDropdownItem.svelte";

	export let type: string;
	export let value;
	export let change;
	export let selected;
	let filteredOptions = {
		urls: [],
		text: [],
		selection: [],
	};

	const urls = ["url", "twitter", "icon", "image"];
	const text = ["title", "site_name", "description", "selection"];
	let focused: boolean = false;

	forEach($webData, (value, key) => {
		if (urls.includes(key) && value) {
			filteredOptions.urls.push({
				text: value,
				value: value,
				type: key,
				icon: icons[key],
			});
		} else if (text.includes(key) && value) {
			filteredOptions.text.push({
				text: value,
				value: value,
				type: key,
				icon: icons[key],
			});
		}
	});

	// reverse order of filteredOptions.text
	filteredOptions.text = filteredOptions.text.reverse();
	filteredOptions.urls = filteredOptions.urls.reverse();

	console.log("Web Data: ", $webData);
	console.log("Filtered: ", filteredOptions);
</script>

<div class="main">
	<Svelecte
		options={$webData}
		dropdownItem={WebDataDropdownItem}
		controlItem={WebDataDropdownItem}
		class="svlecte-control webdata"
		placeholder=""
		bind:value
		bind:readSelection={selected}
		searchable={false}
		on:change={change}
		groupLabelField="groupHeader"
		groupItemsField="items"
		valueField="text"
	>
		<div slot="icon">
			{#if !value}
				<div class="placeholder-icon">
					<Icon
						name="web"
						color={"gray-400"}
						position="m"
					/>
					Web Data
				</div>
			{/if}
		</div>
	</Svelecte>
</div>

<style lang="scss">
	@use "../../style/global" as *;
	.main {
		align-self: flex-start;
		height: 100%;
		width: 100%;
	}
	:global {
		.webdata {
			height: 100%;
			align-items: center;
			justify-content: center;
			flex: unset !important;
			display: flex;
			position: unset !important;
			background-color: var(--bg-tertiary) !important;
			transition: $transition;
			&:hover {
				background-color: var(--bg-secondary);
			}
			&:has(.is-active) {
				background-color: var(--bg-secondary) !important;
			}
			.sv-control {
				justify-content: center;
				min-height: unset !important;
				height: 100% !important;
				width: fit-content !important;
				background-color: var(--bg-tertiary) !important;
				border-radius: 0 !important;
				border: none !important;
				cursor: pointer;
				box-sizing: border-box;
				outline: none;
				box-shadow: none !important;
				position: unset !important;

				&.is-active {
					background-color: var(--bg-secondary) !important;
				}

				.sv-content {
					padding: 0 !important;
				}

				.icon-slot {
					box-sizing: border-box;
				}
				.placeholder-icon {
					padding: 0.5rem 0 0.5rem 0.5rem !important;
					@include ui-text(var(--gray-500), $p14, 400);
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: center;
					column-gap: $p3;
				}

				.indicator-container {
					padding: 0 0.25rem 0 0.25rem !important;

					> svg {
						color: rgb(204, 204, 204) !important;
						fill: rgb(204, 204, 204) !important;
					}
				}

				.inputBox {
					width: 0 !important;
					margin: 0 !important;
					position: absolute !important;
				}

				.sv-item {
					padding: 0 !important;

					.sv-item-content {
						@include flex(row, center, center);

						.type-icon {
							padding: 1px 0 0 0.25rem !important;

							svg {
								opacity: 0.8;
								height: 1.25rem !important;
							}

							&.smaller {
								svg {
									height: 1rem !important;
								}
							}
						}
					}
				}

				&:has(.sv-item) {
					.icon-slot {
						display: none !important;
					}
				}
			}

			.sv-dropdown {
				background-color: var(--bg) !important;
				width: 368px !important;
				left: 12px !important;
				margin-top: 0.75rem !important;
				z-index: 3 !important;
				top: 100% !important;
				.sv-dropdown-scroll {
					padding: 0 !important;
				}
				.sv-dd-item-active {
					background: none !important;
				}

				.sv-dd-item {
					margin-left: 0 !important;
				}

				.sv-item {
					margin: 0.25rem 0 0.25rem 0.25rem !important;
					width: calc(100% - 0.5rem) !important;
					height: auto !important;
					box-sizing: border-box;

					.sv-item-content {
						@include flex(column !important, flex-start, flex-start);
						padding: 0.25rem !important;
						width: 100% !important;
						border-radius: var(--border-radius);
						background-color: var(--bg-dark) !important;
						box-sizing: border-box;

						&:hover {
							background-color: var(--bg-darker) !important;
							box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.07);
						}

						.type-container {
							@include flex(row, flex-start, flex-start);
							width: 100%;
							padding: 0.25rem 0.25rem 0.25rem 0 !important;
							box-sizing: border-box;
							.type-icon {
								@include flex(row, flex-start, center);
								padding: 0 !important;

								svg {
									height: 18px !important;
								}

								&.smaller {
									svg {
										height: 16px !important;
									}
								}
							}

							.type-text {
								@include flex(column, flex-start, flex-start);
								padding: 0 0 0 0.25rem !important;
								width: 100%;
								box-sizing: border-box;

								.type-label {
									@include ui-text(var(--text-dark), 0.875rem, 500);
									margin-left: 0.125rem;
									padding: 0 0.25rem 0.25rem 0;
									width: 100%;
									box-sizing: border-box;
								}

								.type-source {
									width: 100%;
									@include ui-text(var(--text-light), 0.75rem, 500);
									padding: 0.25rem 0 0 0.25 !important;
									box-sizing: border-box;
									overflow: hidden;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 1;
									/* number of lines to show */
									line-clamp: 1;
									-webkit-box-orient: vertical;
									margin-left: auto;
									text-align: end;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
