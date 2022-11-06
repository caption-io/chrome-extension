<script lang="ts">
	import Svelecte from "svelecte";
	import { webData, dropdownExtraHeight } from "src/scripts/platform/stores";
	import { clickOutside } from "src/scripts/platform/ui-utils";
	import Icon from "./Icon.svelte";
	import WebDataDropdownItem from "./WebDataDropdownItem.svelte";

	export let type: string;
	export let value;
	

	const urls = ["url", "twitter", "icon", "image"];
	const text = ["title", "site_name", "description", "selection"];
	let focused: boolean = false;
	console.log($webData);
	// let filtered;
	// $: filtered.exact = $webData.length >= 1 ? $webData.filter((data) => {
	// 	const typeTranslate = type === "url" || type === "title" || type === "text" || type === "file" ? "text" : type;
	// 	const typeTranslateData = data.type === "url" || data.type === "title" || data.type === "text" || data.type === "file" ? "text" : data.type;
	// 	console.log("Filtered: ",data, "Type: ", typeTranslate);

	// 	if (typeTranslateData === typeTranslate) {
	// 		return data;
	// 	};
	// }) : [];
	let svEl;
	function selectClicked() {
		if (svEl.firstChild.childNodes.item(2).firstChild) {
			dropdownExtraHeight.set(svEl.firstChild.childNodes.item(2).firstChild.parentElement);
			console.log($dropdownExtraHeight)
		}
	}

	console.log("Web Data: ", $webData);
</script>

{#if $webData}
<div 
	class="main"
	bind:this={svEl}
	on:click={selectClicked}
	on:outclick={selectClicked}
	>
	<Svelecte
		options={$webData}
		dropdownItem={WebDataDropdownItem}
		controlItem={WebDataDropdownItem}
		class="svlecte-control webdata"
		placeholder=""
		bind:value
		searchable={false}
		groupLabelField="groupHeader"
		groupItemsField="items"
		valueAsObject={true}
	>
		<div slot="icon">
			{#if !value}
				<div class="placeholder-icon">
					<Icon
						icon="web"
						color="gray"
						size={16}
					/>
				</div>
			{/if}
		</div>
	</Svelecte>
</div>
{/if}

<style lang="scss">
	@use "../../style/global" as *;
	.main {
		align-self: flex-start;
		height: 100%;
	}
	:global {
		.webdata {
			height: 100%;
			align-items: center;
			justify-content: center;
			flex: unset !important;
			display: flex;
			background-color: var(--bg-tertiary) !important;
			transition: $transition;
			position: unset !important;
			border-radius: $border-radius;
			&:hover {
				background-color: var(--bg-secondary) !important;
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
				border-radius: $border-radius !important;
				overflow: hidden;
				border: none !important;
				cursor: pointer;
				box-sizing: border-box;
				outline: none;
				box-shadow: none !important;

				&.is-active, &:hover {
					background-color: var(--bg-secondary) !important;
				}

				.sv-content {
					padding: 0 !important;
					position: unset !important;
				}

				.icon-slot {
					box-sizing: border-box;
				}
				.placeholder-icon {
					padding: 0.375rem 0 0.375rem 0.5rem !important;
					@include ui-text(var(--gray-500), $p14, 400);
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: center;
					column-gap: $p3;
					margin-left: 0 !important;
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
					position: relative !important;
					padding: 0 !important;
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
				width: calc(100% - $p24) !important;
				left: 0 !important;
				margin: $p8 $p12 $p6 $p12 !important;
				z-index: 3 !important;
				top: 100% !important;
				box-sizing: content-box;
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
