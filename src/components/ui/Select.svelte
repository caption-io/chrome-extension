<script lang="ts">
	import Icon from "./Icon.svelte";

	import { clickOutside } from "src/scripts/platform/ui-utils";
	import {
		dropdownExtraHeight,
		selectedFlow,
	} from "src/scripts/platform/stores";
	import { slide, fly, crossfade, fade } from "svelte/transition";
	import { createEventDispatcher } from "svelte";
	import Button from "./Button.svelte";
	import { flip } from "svelte/animate";
	import { quintOut } from "svelte/easing";
	import { find, isMatch, matches } from "lodash-es";
	import type { Options } from "svelte-dnd-action";
	export let options = [];
	export let simpleOptions = false;
	export let multiple: boolean = false;
	export let disabled: boolean = false;
	export let placeholder: string = "Select...";
	export let placeholderIcon: Icons = null;
	export let fieldIcon: Icons = null;
	export let hasIcons: boolean = false;
	export let valueField: string = "id";
	export let labelField: string = "name";
	export let groupHeaderField: string = null;
	export let groupItemsField: string = null;
	export let itemStyle: "default" | "select" | "status" | "tag" = "default";
	export let minimalControl: boolean = false;
	export let value: any = null;
	export let clearable: boolean = true;
	export let searchable: boolean = false;
	export let valueAsObject: boolean = false;
	export let noFill: boolean = false;
	export let dropdownRelative: boolean = false;
	export let small = false;
	export let createable: boolean = false;
	export let prefix: string = null;
	export let lightBg: boolean = false;

	let searchInput: string = null;
	let searchInputEl: HTMLInputElement;
	let focused: boolean = false;
	let isGrouped: boolean = groupHeaderField !== null;
	let dropdownOpen: boolean = false;
	let activeItem;
	let dropdownEl: HTMLElement;
	let hovered = false;
	let createActive: boolean = false;
	let deleteConfirm = null;
	let optionsFiltered = options;

	let dbgOn = false;
	function dbg(message) {
		if (dbgOn) {
			console.log("Select Component: ", message);
		}
	}

	dbg({ options: options, value: value, valueObject: getItemObject(value) });

	const [send, receive] = crossfade({
		duration: 400,
		easing: quintOut,
	});

	const dispatch = createEventDispatcher();

	$: if (dropdownOpen) {
		document.addEventListener("keydown", keyboardHandler);
	} else {
		document.removeEventListener("keydown", keyboardHandler);
		dropdownExtraHeight.set(0);
	}
	let oldValue = value;
	function valueUpdated(val) {
		if (val !== oldValue) {
			dbg({ valueUpdated: val });
			dispatch("valuechange", val);
			oldValue = val;
		} else {
			dbg({
				text: "Value tried updating but values matched",
				oldValue: value,
				newValue: val,
			});
		}
	}
	let oldOptions = options;
	function optionsUpdated(opts) {
		if (opts !== oldOptions) {
			dbg({ optionsUpdated: opts });
			dispatch("optionschange", opts);
			oldOptions = opts;
		} else {
			dbg({
				text: "Options tried updating but options matched",
				oldValue: options,
				newValue: opts,
			});
		}
	}

	$: valueUpdated(value);
	$: optionsUpdated(options);

	function dropdownHandle(state: boolean = null, clear: boolean = false) {
		if (state === null) {
			dropdownOpen = !dropdownOpen;
			focused = !focused;
		} else if (state === true) {
			dropdownOpen = true;
			focused = true;
		} else {
			dropdownOpen = false;
			focused = false;
		}
		if (clear) {
			searchInput = null;
		}
	}

	function clearValue() {
		value = null;
	}

	function valueSet(val) {
		if (valueAsObject) {
			return val;
		} else if (val[valueField]) {
			return val[valueField];
		} else {
			console.error("Value field not found: ", val);
		}
	}

	function multipleValueFilter(val) {
		if (multiple && value) {
			let opts = options.filter((opt) => {
				return !value.includes(valueSet(opt));
			});
			optionsFiltered = opts;
		} else if (multiple && !value) {
			optionsFiltered = options;
		}
	}
	$: multipleValueFilter(value);

	function searchFilter(query) {
		if (query) {
			let opts = options.filter((opt) => {
				let optName = opt[labelField].toLowerCase().replaceAll(" ", "-");
				let search = query.toLowerCase().replaceAll(" ", "-");
				if (optName.includes(search)) {
					return true;
				}
			});
			optionsFiltered = opts;
		}
	}
	$: searchFilter(searchInput);

	function itemSelect(item) {
		if (
			options.find(
				(o) => getItemObject(valueSet(o)) === getItemObject(valueSet(item))
			)
		) {
			if (multiple) {
				if (value) {
					value = [...value, valueSet(item)];
				} else {
					value = [valueSet(item)];
				}
			} else {
				value = valueSet(item);
				dropdownHandle(false, true);
			}
		}
	}

	function getItemObject(v) {
		if (!valueAsObject) {
			dbg({ getItemObject: options.find((o) => o[valueField] === v) });
			return options.find((o) => o[valueField] === v);
		} else {
			return v;
		}
	}

	function itemRemove(item) {
		let valueFiltered = value.filter((val) => {
			return (
				val !== valueSet(item) && val.toString() !== valueSet(item).toString()
			);
		});
		if (valueFiltered.length > 0) {
			value = valueFiltered;
		} else {
			value = null;
		}
	}

	function itemDelete(item) {
		optionsFiltered = options.filter((opt) => {
			return valueSet(opt) !== valueSet(item);
		});
		if (optionsFiltered.length > 0) {
			options = optionsFiltered;
		} else {
			options = null;
		}
		if (multiple) {
			itemRemove(item);
		} else if (value === valueSet(item)) {
			value = null;
		}
	}

	function itemCreate(item) {
		for (let i = 0; i < options.length; i++) {
			if (options[i][labelField] === item[labelField]) {
				return;
			}
		}
		if (options) {
			options = [...options, item];
			itemSelect(item);
		} else {
			options = [item];
			itemSelect(item);
		}
		searchInput = null;
	}

	function scrollIntoView(groupIndex: number = null, itemIndex: number) {
		if (dropdownEl) {
			let dropRect = dropdownEl.getBoundingClientRect();
			let itemRect = groupIndex
				? dropdownEl.children[groupIndex].children[
						itemIndex
				  ].getBoundingClientRect()
				: dropdownEl.children[itemIndex].getBoundingClientRect();

			let scroll = dropdownEl.scrollTop;
			if (itemRect.top < dropRect.top) {
				scroll = scroll - (dropRect.top - itemRect.top + 8);
			} else if (itemRect.bottom > dropRect.bottom) {
				scroll = scroll + (itemRect.bottom - dropRect.bottom + 8);
			} else {
				return;
			}
			dropdownEl.scrollTop = scroll;
		}
	}

	function keyboardHandler(e) {
		if (e.key === "Escape" && dropdownOpen) {
			focused = false;
			dropdownOpen = false;
			searchInput = null;
		} else if (e.key === "ArrowDown" && dropdownOpen) {
			e.preventDefault();
			if (isGrouped) {
				if (activeItem === null) {
					activeItem = valueSet(optionsFiltered[0][groupItemsField][0]);
					scrollIntoView(0, 0);
				} else {
					let activeGroup = optionsFiltered.find((g) =>
						g[groupItemsField].includes(activeItem)
					);
					let activeGroupIndex = optionsFiltered.indexOf(activeGroup);
					let activeItemIndex = valueAsObject
						? activeGroup[groupItemsField].indexOf(activeItem)
						: activeGroup[groupItemsField].findIndex(
								(i) => i[valueField] === activeItem
						  );
					if (activeItemIndex === activeGroup[groupItemsField].length - 1) {
						if (activeGroupIndex === optionsFiltered.length - 1) {
							activeItem = valueSet(optionsFiltered[0][groupItemsField][0]);
							scrollIntoView(0, 0);
						} else {
							activeItem = valueSet(
								optionsFiltered[activeGroupIndex + 1][groupItemsField][0]
							);
							scrollIntoView(activeGroupIndex + 1, 0);
						}
					} else {
						activeItem = valueSet(
							activeGroup[groupItemsField][activeItemIndex + 1]
						);
						scrollIntoView(activeGroupIndex, activeItemIndex + 1);
					}
				}
			} else {
				if (activeItem === null) {
					if (createable && searchInput && !createActive) {
						activeItem = null;
						createActive = true;
					} else {
						createActive = false;
						activeItem = valueSet(optionsFiltered[0]);
						scrollIntoView(null, 0);
					}
				} else {
					let activeItemIndex = valueAsObject
						? optionsFiltered.indexOf(activeItem)
						: optionsFiltered.findIndex((o) => o[valueField] === activeItem);
					if (activeItemIndex === optionsFiltered.length - 1 && !createActive) {
						createActive = false;
						activeItem = valueSet(optionsFiltered[0]);
						scrollIntoView(null, 0);
					} else if (
						activeItemIndex === optionsFiltered.length - 1 &&
						!createActive
					) {
						activeItem = null;
						createActive = true;
					} else {
						createActive = false;
						activeItem = valueSet(optionsFiltered[activeItemIndex + 1]);
						scrollIntoView(null, activeItemIndex + 1);
					}
				}
			}
		} else if (e.key === "ArrowUp" && dropdownOpen) {
			e.preventDefault();
			if (isGrouped) {
				if (activeItem === null) {
					activeItem = valueSet(
						optionsFiltered[optionsFiltered.length - 1][groupItemsField][
							optionsFiltered[optionsFiltered.length - 1][groupItemsField]
								.length - 1
						]
					);
					scrollIntoView(
						optionsFiltered.length - 1,
						optionsFiltered[optionsFiltered.length - 1][groupItemsField]
							.length - 1
					);
				} else {
					let activeGroup = optionsFiltered.find((g) =>
						g[groupItemsField].includes(activeItem)
					);
					let activeGroupIndex = optionsFiltered.indexOf(activeGroup);
					let activeItemIndex = valueAsObject
						? activeGroup[groupItemsField].indexOf(activeItem)
						: activeGroup[groupItemsField].findIndex(
								(i) => i[valueField] === activeItem
						  );
					if (activeItemIndex === 0) {
						if (activeGroupIndex === 0) {
							activeItem = valueSet(
								optionsFiltered[optionsFiltered.length - 1][groupItemsField][
									optionsFiltered[optionsFiltered.length - 1][groupItemsField]
										.length - 1
								]
							);
							scrollIntoView(
								optionsFiltered.length - 1,
								optionsFiltered[optionsFiltered.length - 1][groupItemsField]
									.length - 1
							);
						} else {
							activeItem = valueSet(
								optionsFiltered[activeGroupIndex - 1][groupItemsField][
									optionsFiltered[activeGroupIndex - 1][groupItemsField]
										.length - 1
								]
							);
							scrollIntoView(
								activeGroupIndex - 1,
								optionsFiltered[activeGroupIndex - 1][groupItemsField].length -
									1
							);
						}
					} else {
						activeItem = valueSet(
							activeGroup[groupItemsField][activeItemIndex - 1]
						);
						scrollIntoView(activeGroupIndex, activeItemIndex - 1);
					}
				}
			} else {
				if (activeItem === null) {
					if (createable && searchInput && !createActive) {
						activeItem = null;
						createActive = true;
					} else {
						createActive = false;
						activeItem = valueSet(optionsFiltered[optionsFiltered.length - 1]);
						scrollIntoView(null, optionsFiltered.length - 1);
					}
				} else {
					let activeItemIndex = valueAsObject
						? optionsFiltered.indexOf(activeItem)
						: optionsFiltered.findIndex((o) => o[valueField] === activeItem);
					if (activeItemIndex === 0 && createActive) {
						activeItem = valueSet(optionsFiltered[optionsFiltered.length - 1]);
						scrollIntoView(null, optionsFiltered.length - 1);
					} else if (activeItemIndex === 0 && !createActive) {
						activeItem = null;
						createActive = true;
					} else {
						createActive = false;
						activeItem = valueSet(optionsFiltered[activeItemIndex - 1]);
						scrollIntoView(null, activeItemIndex - 1);
					}
				}
			}
		} else if (e.key === "Enter") {
			if (
				activeItem !== null &&
				dropdownOpen &&
				optionsFiltered.length > 0 &&
				!createActive
			) {
				itemSelect(getItemObject(activeItem));
				searchInput = null;
				activeItem =
					optionsFiltered.length > 0 ? valueSet(optionsFiltered[0]) : null;
			} else if (createable && searchInput && createActive) {
				itemCreate({
					[labelField]: searchInput,
					[valueField]: searchInput,
				});
			} else if (!dropdownOpen) {
				dropdownOpen = true;
				focused = true;
			}
		} else if (e.key === "Backspace") {
			if (searchInput === null || searchInput === "") {
				if (multiple && value.length > 0) {
					itemRemove(getItemObject(value[value.length - 1]));
				}
			} else if (searchInput !== null) {
				searchInput = searchInput.slice(0, -1);
			}
		} else if (e.key.length === 1) {
			if (searchable || createable) {
				if (searchInput === null) {
					searchInput = e.key;
					if (createable && searchInput) {
						activeItem = null;
						createActive = true;
					} else if (optionsFiltered.length > 0) {
						activeItem = valueSet(optionsFiltered[0]);
					} else {
						activeItem = null;
					}
				} else {
					searchInput += e.key;
					if (createable && searchInput) {
						activeItem = null;
						createActive = true;
					} else if (optionsFiltered.length > 0) {
						activeItem = valueSet(optionsFiltered[0]);
					} else {
						activeItem = null;
					}
				}
			}
		}
	}

	$: if (dropdownOpen && dropdownEl) {
		// 200ms timeout to allow for the dropdown to render before calculating its height
		setTimeout(() => {
			let bodyRect = document.getElementById("height");

			if (
				bodyRect.getBoundingClientRect().bottom <
				dropdownEl.getBoundingClientRect().bottom
			) {
				dropdownExtraHeight.set(dropdownEl.getBoundingClientRect().bottom + 24);
			}
		}, 100);

		// scroll dropdownEl bottom into view if it's not already
	}
</script>

<div
	class="select-container"
	class:disabled
	class:noFill={noFill ? true : small ? true : false}
	style:position={dropdownRelative ? "unset" : "relative"}
	use:clickOutside
	on:outclick={() => dropdownHandle(false, true)}
>
	<div
		class="select-control"
		class:focused
		class:small
		class:lightBg
		tabindex="0"
		on:click={() => {
			dropdownHandle();
		}}
		on:focusin={() => {
			document.addEventListener("keydown", keyboardHandler);
		}}
		on:focusout={() => {
			document.removeEventListener("keydown", keyboardHandler);
		}}
		on:mouseenter={() => (hovered = true)}
		on:mouseleave={() => (hovered = false)}
	>
		{#if fieldIcon}
			<div class="field-icon">
				<Icon
					icon={fieldIcon}
					size={16}
					color="inherit"
				/>
			</div>
		{/if}
		{#if value && multiple}
			<div class="multi-item-container">
				{#each value as v (getItemObject(v)[valueField])}
					<div
						class="select-item control-item multiple {itemStyle}"
						class:minimalControl
						animate:flip={{ duration: 200 }}
						out:send={{ key: getItemObject(v)[valueField] }}
						in:receive={{ key: getItemObject(v)[valueField] }}
						style={(itemStyle === "select" && getItemObject(v).color) ||
						(itemStyle === "status" && getItemObject(v).color)
							? `--item-color: var(--${getItemObject(v).color})`
							: "--item-color: var(--bg-tertiary)"}
					>
						{#if hasIcons}
							<div class="select-item-icon">
								{#if options.find( (o) => isMatch(valueSet(o), v) ) && options.find( (o) => isMatch(valueSet(o), v) ).icon && getItemObject(v).icon.startsWith("http")}
									<Icon
										url={getItemObject(v).icon}
										size={16}
									/>
								{:else}
									<Icon
										icon={getItemObject(v).icon}
										size={16}
									/>
								{/if}
							</div>
						{/if}
						<div class="select-item-label">
							{#if prefix}<span class="prefix">{prefix}</span>{/if}
							{options.find((o) => valueSet(o) === valueSet(getItemObject(v)))[
								labelField
							]}
						</div>
						<div
							class="select-item-close"
							on:click={(e) => {
								e.stopPropagation();
								itemRemove(getItemObject(v));
							}}
						>
							<Icon
								icon="close"
								size={12}
								color="inherit"
							/>
						</div>
					</div>
				{/each}
				{#if !value || searchInput || value === ""}
					<div class="placeholder">
						{#if placeholderIcon}
							<div
								class="placeholder-icon"
								style="margin-right: {placeholder ? '0.5rem' : '0'}"
							>
								<Icon
									icon={placeholderIcon}
									size={16}
									color="gray"
								/>
							</div>
						{/if}
						{#if placeholder && !searchable && !createable}
							<div class="placeholder-text">
								{placeholder}
							</div>
						{:else}
							<input
								class="placeholder-text searchable"
								contenteditable
								bind:this={searchInputEl}
								bind:value={searchInput}
								{placeholder}
								use:clickOutside
								tabindex="-1"
								on:click={(e) => {
									e.preventDefault();
									searchInputEl.blur();
								}}
								on:outclick={() => {
									if (searchInput !== placeholder) {
										searchInputEl.value = null;
										searchInput = null;
									}
								}}
								on:keydown={(e) => {
									e.preventDefault();
								}}
							/>
						{/if}
					</div>
				{/if}
			</div>
		{:else if value && !searchInput}
			{@const item = getItemObject(value)}
			<div
				class="select-item control-item {itemStyle}"
				class:minimalControl
				style={(itemStyle === "select" && item.color) ||
				(itemStyle === "status" && item.color)
					? `--item-color: var(--${item.color})`
					: "--item-color: var(--bg-tertiary)"}
				in:fade={{ duration: 200 }}
			>
				{#if hasIcons}
					<div class="select-item-icon">
						{#if item.icon && item.icon.startsWith("http")}
							<Icon
								url={item.icon}
								size={16}
							/>
						{:else}
							<Icon
								icon={item.icon}
								size={16}
							/>
						{/if}
					</div>
				{/if}
				{#if !minimalControl}
					{#if prefix}<span class="prefix">{prefix}</span>{/if}
					{item[labelField]}
				{/if}
			</div>
		{/if}
		{#if !value || searchInput}
			{#if !multiple}
				<div class="placeholder">
					{#if placeholderIcon}
						<div
							class="placeholder-icon"
							style="margin-right: {placeholder ? '0.5rem' : '0'}"
						>
							<Icon
								icon={placeholderIcon}
								size={16}
								color="gray"
							/>
						</div>
					{/if}
					{#if placeholder && !searchable && !createable}
						<div class="placeholder-text">
							{placeholder}
						</div>
					{:else}
						{#if prefix && searchInput}<span class="prefix">{prefix}</span>{/if}
						<input
							class="placeholder-text searchable"
							contenteditable
							bind:this={searchInputEl}
							bind:value={searchInput}
							{placeholder}
							use:clickOutside
							tabindex="-1"
							on:click={(e) => {
								e.preventDefault();
								searchInputEl.blur();
							}}
							on:outclick={() => {
								if (searchInput !== placeholder) {
									searchInputEl.value = null;
									searchInput = null;
								}
							}}
							on:keydown={(e) => {
								e.preventDefault();
							}}
						/>
					{/if}
				</div>
			{/if}
		{/if}
		<div class="controls">
			{#if value && clearable}
				<div
					class="clear-button"
					class:hovered
				>
					<Button
						icon="close"
						size="sm"
						color="red"
						style="minimal"
						on:click={(e) => {
							e.stopPropagation();
							clearValue();
						}}
					/>
				</div>
			{/if}
			<slot name="badge" />
			<div class="select-arrow">
				<Icon
					icon="chevronRight"
					size={16}
					color="inherit"
				/>
			</div>
		</div>
	</div>
	{#if dropdownOpen}
		<div
			class="select-dropdown"
			class:small
			transition:slide={{ duration: 200 }}
			bind:this={dropdownEl}
		>
			{#if createable && searchInput}
				<div
					class="createable dropdown-item-container"
					class:active={createActive}
					on:click={() => {
						itemCreate({
							[labelField]: searchInput,
							[valueField]: searchInput,
						});
					}}
				>
					<Icon
						icon="add"
						size={16}
						color="inherit"
					/>
					Create
					<div class="create-item select-item {itemStyle}">
						{#if prefix}<span class="prefix">{prefix}</span>{/if}
						{searchInput}
					</div>
				</div>
			{/if}
			{#if isGrouped}
				{#each options as group, i}
					<div class="select-group">
						<div class="select-group-header">
							{group[groupHeaderField]}
						</div>
						<div class="select-group-items">
							{#each group[groupItemsField] as item, i (item.id)}
								<div
									class="dropdown-item-container"
									animate:flip={{ duration: 200 }}
									on:click={(e) => {
										if (multiple) {
											e.stopPropagation();
										}
										itemSelect(valueSet(item));
									}}
									on:mouseenter={() => (activeItem = valueSet(item))}
									class:active={valueSet(item) === activeItem}
								>
									<div
										class="select-item dropdown-item {itemStyle}"
										class:active={valueSet(item) === activeItem}
										id={item.id}
										style={(itemStyle === "select" && item.color) ||
										(itemStyle === "status" && item.color)
											? `--item-color: var(--${item.color})`
											: "--item-color: var(--bg-tertiary)"}
									>
										{#if hasIcons}
											<div class="select-item-icon">
												{#if item.icon && item.icon.startsWith("http")}
													<Icon
														url={item.icon}
														size={16}
													/>
												{:else}
													<Icon
														icon={item.icon}
														size={16}
													/>
												{/if}
											</div>
										{/if}
										<div class="select-item-label">
											{item[labelField]}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			{:else if options && optionsFiltered.length > 0}
				{#each optionsFiltered as item (item.id)}
					<div
						class="dropdown-item-container"
						animate:flip={{ duration: 200 }}
						on:click={(e) => {
							if (multiple) {
								e.stopPropagation();
							}
							itemSelect(item);
						}}
						on:mouseenter={() => (activeItem = valueSet(item))}
						class:active={valueSet(item) === activeItem}
						out:fade={{ duration: 200 }}
					>
						<div
							class="select-item dropdown-item {itemStyle}"
							out:send={{ key: item[valueField] }}
							in:receive={{ key: item[valueField] }}
							id={item.id}
							style={(itemStyle === "select" && item.color) ||
							(itemStyle === "status" && item.color)
								? `--item-color: var(--${item.color})`
								: "--item-color: var(--bg-tertiary)"}
						>
							{#if hasIcons}
								<div class="select-item-icon">
									{#if item.icon && item.icon.includes("http")}
										<Icon
											url={item.icon}
											size={16}
											color="gray"
										/>
									{:else}
										<Icon
											icon={item.icon}
											size={16}
										/>
									{/if}
								</div>
							{/if}
							<div class="select-item-label">
								{#if prefix}<span class="prefix">{prefix}</span>{/if}
								{item[labelField]}
							</div>
						</div>
						{#if createable && deleteConfirm !== item[valueField]}
							<div
								class="delete-item"
								on:click={(e) => {
									e.stopPropagation();
									deleteConfirm = item.id;
								}}
								in:fly={{ duration: 200, x: -48 }}
							>
								<Icon
									icon="trash"
									size={16}
									color="inherit"
								/>
							</div>
						{/if}
						{#if deleteConfirm === item.id}
							<div
								class="confirm-delete"
								in:fly={{ duration: 200, x: 48 }}
								use:clickOutside
								on:outclick={() => (deleteConfirm = null)}
							>
								<div class="confirm-text">Are you sure?</div>
								<div
									class="yes-button"
									on:click={(e) => {
										e.stopPropagation();
										deleteConfirm = null;
										itemDelete(item);
									}}
								>
									<Icon
										icon="check"
										size={16}
										color="inherit"
									/>
								</div>
								<div
									class="no-button"
									on:click={(e) => {
										e.stopPropagation();
										deleteConfirm = null;
									}}
								>
									<Icon
										icon="close"
										size={16}
										color="inherit"
									/>
								</div>
							</div>
						{/if}
					</div>
				{/each}
			{:else if !searchInput}
				<slot
					class="select-item no-opt"
					name="no-options">No options</slot
				>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	.select-container {
		width: 100%;
		.prefix {
			color: var(--text-secondary);
			transform: translateY(-1px);
		}
		&.noFill {
			width: auto;
		}
		&.disabled {
			opacity: 0.5;
			pointer-events: none;
		}
		.select-item {
			display: flex;
			align-items: center;
			padding: 0 $p6;
			height: $p24;
			box-sizing: border-box;
			border-radius: var(--border-radius);
			@include ui-text(var(--text), $p14, 400);
			cursor: pointer;
			transition: background-color 0.1s ease;
			position: relative;
			&.select {
				background-color: var(--item-color);
				color: var(--text);
				width: fit-content;
				padding: $p3 $p8;
				border-radius: $p12;
				gap: $p3;
			}

			// &.active {
			// 	background-color: var(--bg-tertiary);
			// }
			// &.status {
			// 	background-color: $color-success;
			// 	color: $color-white;
			// }
			// &.tag {
			// 	background-color: $color-primary;
			// 	color: $color-white;
			// }
			.select-item-icon {
				margin-right: 0.5rem;
				color: var(--text-secondary);
			}
			.select-item-label {
				white-space: nowrap;
				margin-bottom: 1px;
			}
			&.no-opt {
				@include ui-text(var(--text-secondary), $p14, 400);
				cursor: default;
				justify-content: center;
			}
		}
		.select-control {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 0 $p12;
			border: 1px solid var(--border-color-secondary);
			border-radius: $border-radius;
			background-color: var(--bg-secondary);
			min-height: $p42;
			width: 100%;
			box-sizing: border-box;
			box-shadow: var(--input-shadow);
			transition: $transition;
			position: relative;
			&.lightBg {
				border: 1px solid var(--border-color-secondary);
			}
			&:focus-visible {
				border: 1px solid var(--blue);
				outline: none;
			}
			.controls {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				margin-left: auto;
			}

			.multi-item-container {
				@include flex(row, flex-start, flex-start);
				flex-wrap: wrap;
				padding: $p6 0;
				gap: $p6;
				max-width: calc(100% - 44px);
				box-sizing: border-box;
				margin-right: auto;
			}
			.control-item {
				width: 100%;
				padding-left: $p6;
				&.multiple {
					background-color: var(--bg-tertiary);
					width: fit-content;
					padding: $p3 $p3 $p3 $p8;
					border-radius: $p12;
				}
				&.minimalControl {
					margin-right: 0;
					padding: 0;
					.select-item-icon {
						margin-right: 0;
					}
				}
				&.select {
					margin-bottom: 0;
					background-color: var(--item-color);
					width: fit-content;
				}
				.select-item-close {
					color: var(--text);
					transition: 0.3s ease-in-out;
					margin-left: 3px;
					padding: 3px;
					border-radius: 8px;
					background: var(--bg-alpha);
				}
				&:hover {
					.select-item-close {
						color: var(--white);
						background-color: var(--red);
					}
				}
				.prefix {
					margin-right: -3px;
				}
			}

			.field-icon {
				margin-right: 0.5rem;
				color: var(--text-secondary);
			}
			.placeholder {
				@include flex(row, flex-start, center);
				display: flex;
				align-items: center;
				margin-right: auto;
				width: max-content;
				.placeholder-text {
					@include ui-text(var(--text-secondary), $p14, 400);
					&.searchable {
						background: none;
						border: none;
						outline: none;
					}
				}
			}
			.text-input {
				outline: none;
				border: none;
				background: none;
				width: 100%;
			}
			.clear-button {
				margin-left: auto;
				cursor: pointer;
				opacity: 0;
				transition: $transition;
				width: 0;
			}
			.select-arrow {
				margin-left: 0.5rem;
				transition: $transition;
				color: var(--text-secondary);
				transform: rotate(90deg);
			}
			&.focused {
				border-color: var(--blue);
				box-shadow: var(--input-shadow-hover);
				.select-arrow {
					transform: rotate(-90deg);
				}
			}
			&:hover {
				.clear-button {
					opacity: 1;
					width: 24px;
				}
			}
			&.small {
				min-height: $p32;
				padding: 0 $p8;
				width: max-content;
				box-sizing: border-box;
				.select-item {
					padding: $p3 $p6 $p3 $p3;
				}
				.placeholder-text {
					padding-right: $p6;
				}
				.select-arrow {
					margin-left: 0;
				}
			}
		}
		.select-dropdown {
			@include scrollbar();
			position: absolute;
			top: 100%;
			right: 0;
			width: 100%;
			max-height: 20rem;
			overflow-y: auto;
			border: 1px solid var(--border-color);
			border-radius: var(--border-radius);
			background-color: var(--bg-secondary);
			box-sizing: border-box;
			margin-top: $p8;
			box-shadow: var(--input-shadow-heavy);
			padding: $p6;
			transform-origin: top center;
			z-index: 1;
			.select-group {
				.select-group-header {
					padding: 0.5rem 1rem;
					border-bottom: 1px solid var(--border-color);
					background-color: var(--bg-seondary);
				}
				.select-group-items {
					.select-item {
						padding: 0.5rem 1rem;
						&:hover {
							background-color: var(--bg-seondary);
							color: var(--text);
						}
					}
				}
			}
			&.dropdownOpen {
				display: block;
			}
			&.small {
				width: max-content;
				min-width: 100%;
			}
			.dropdown-item-container {
				@include flex(row, space-between, center);
				padding: $p6;
				border-radius: var(--border-radius);
				cursor: pointer;
				overflow: hidden;
				z-index: 2;
				.delete-item {
					opacity: 0;
					pointer-events: none;
					color: var(--text-secondary);
					border-radius: var(--border-radius);
					transition: 100ms ease;
					padding: $p6;
					&:hover {
						background-color: var(--red-light);
						color: var(--red);
					}
				}
				&.active {
					background-color: var(--bg);
					.delete-item {
						opacity: 1;
						pointer-events: all;
						cursor: pointer;
					}
				}
				.prefix {
					margin-right: -3px;
				}
				.confirm-delete {
					@include flex(row, flex-start, center);
					.confirm-text {
						@include ui-text(var(--text-secondary), $p14, 400);
						padding-right: $p6;
					}
					.yes-button {
						color: var(--red);
						padding: $p6;
						border-radius: var(--border-radius);
						&:hover {
							background-color: var(--red-light);
						}
					}
					.no-button {
						color: var(--text-secondary);
						padding: $p6;
						border-radius: var(--border-radius);

						&:hover {
							background-color: var(--bg-secondary);
						}
					}
				}
			}
			.createable {
				@include flex(row, flex-start, center);
				@include ui-text(var(--text-secondary), $p14, 400);
				height: 24px;
				gap: $p6;
				.create-item {
					font-weight: 500;
				}
			}
		}
	}
</style>
