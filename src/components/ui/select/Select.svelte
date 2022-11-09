<script lang="ts">
	import Icon from "../Icon.svelte";

	import { clickOutside } from "src/scripts/platform/ui-utils";
	import { dropdownExtraHeight } from "src/scripts/platform/stores";
	import { slide } from "svelte/transition";
	import { createEventDispatcher } from "svelte";
	import Button from "../Button.svelte";
	import { flip } from "svelte/animate";

	export let options = [];
	export let simpleOptions = false;
	export let multiple: boolean = false;
	export let disabled: boolean = false;
	export let placeholder: string = null;
	export let placeholderIcon: Icons = null;
	export let fieldIcon: Icons = null;
	export let hasIcons: boolean = false;
	export let valueField: string = "id";
	export let labelField: string = "name";
	export let groupHeaderField: string = null;
	export let groupItemsField: string = null;
	export let itemStyle: "default" | "select" | "status" | "tag" = "default";
	export let minimalControl: boolean = false;
	export let value = null;
	export let clearable: boolean = true;
	export let searchable: boolean = false;
	export let valueAsObject: boolean = false;
	export let noFill: boolean = false;
	export let dropdownRelative: boolean = false;

	let searchInput: string = null;
	let focused: boolean = false;
	let isGrouped: boolean = groupHeaderField !== null;
	let dropdownOpen: boolean = false;
	let activeItem;
	let dropdownEl: HTMLElement;

	const dispatch = createEventDispatcher();

	console.log("options", options);

	function valueObject(option) {
		if (valueAsObject) {
			return option;
		} else {
			return option[valueField];
		}
	}

	function itemSelect(itemValue) {
		console.log("itemSelect", itemValue);
		if (!value && multiple) {
			value=[]
		}
		if (multiple) {
			if (value.includes(itemValue)) {
				value = value.filter((v) => v !== itemValue);
				dispatch("select", value);
			} else {
				value = [...value, itemValue];
				dispatch("select", value);
			}
		} else {
			value = itemValue;
			focused = false;
			dropdownOpen = false;
			dispatch("select", value);
		}
	}

	function itemRemove(itemValue) {
		value = value.filter((v) => v !== itemValue);
		dispatch("select", value);
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
		console.log("keyboardHandler", e);
		if (e.key === "Escape" && dropdownOpen) {
			focused = false;
			dropdownOpen = false;
		} else if (e.key === "ArrowDown" && dropdownOpen) {
			e.preventDefault();
			if (isGrouped) {
				if (activeItem === null) {
					activeItem = valueObject(options[0][groupItemsField][0]);
					scrollIntoView(0, 0);
				} else {
					let activeGroup = options.find((g) =>
						g[groupItemsField].includes(activeItem)
					);
					let activeGroupIndex = options.indexOf(activeGroup);
					let activeItemIndex = valueAsObject
						? activeGroup[groupItemsField].indexOf(activeItem)
						: activeGroup[groupItemsField].findIndex(
								(i) => i[valueField] === activeItem
						  );
					if (activeItemIndex === activeGroup[groupItemsField].length - 1) {
						if (activeGroupIndex === options.length - 1) {
							activeItem = valueObject(options[0][groupItemsField][0]);
							scrollIntoView(0, 0);
						} else {
							activeItem = valueObject(
								options[activeGroupIndex + 1][groupItemsField][0]
							);
							scrollIntoView(activeGroupIndex + 1, 0);
						}
					} else {
						activeItem = valueObject(
							activeGroup[groupItemsField][activeItemIndex + 1]
						);
						scrollIntoView(activeGroupIndex, activeItemIndex + 1);
					}
				}
			} else {
				if (activeItem === null) {
					activeItem = valueObject(options[0]);
					scrollIntoView(null, 0);
				} else {
					let activeItemIndex = valueAsObject
						? options.indexOf(activeItem)
						: options.findIndex((o) => o[valueField] === activeItem);
					if (activeItemIndex === options.length - 1) {
						activeItem = valueObject(options[0]);
						scrollIntoView(null, 0);
					} else {
						activeItem = valueObject(options[activeItemIndex + 1]);
						scrollIntoView(null, activeItemIndex + 1);
					}
				}
			}
		} else if (e.key === "ArrowUp" && dropdownOpen) {
			e.preventDefault();
			if (isGrouped) {
				if (activeItem === null) {
					activeItem = valueObject(
						options[options.length - 1][groupItemsField][
							options[options.length - 1][groupItemsField].length - 1
						]
					);
					scrollIntoView(
						options.length - 1,
						options[options.length - 1][groupItemsField].length - 1
					);
				} else {
					let activeGroup = options.find((g) =>
						g[groupItemsField].includes(activeItem)
					);
					let activeGroupIndex = options.indexOf(activeGroup);
					let activeItemIndex = valueAsObject
						? activeGroup[groupItemsField].indexOf(activeItem)
						: activeGroup[groupItemsField].findIndex(
								(i) => i[valueField] === activeItem
						  );
					if (activeItemIndex === 0) {
						if (activeGroupIndex === 0) {
							activeItem = valueObject(
								options[options.length - 1][groupItemsField][
									options[options.length - 1][groupItemsField].length - 1
								]
							);
							scrollIntoView(
								options.length - 1,
								options[options.length - 1][groupItemsField].length - 1
							);
						} else {
							activeItem = valueObject(
								options[activeGroupIndex - 1][groupItemsField][
									options[activeGroupIndex - 1][groupItemsField].length - 1
								]
							);
							scrollIntoView(
								activeGroupIndex - 1,
								options[activeGroupIndex - 1][groupItemsField].length - 1
							);
						}
					} else {
						activeItem = valueObject(
							activeGroup[groupItemsField][activeItemIndex - 1]
						);
						scrollIntoView(activeGroupIndex, activeItemIndex - 1);
					}
				}
			} else {
				if (activeItem === null) {
					activeItem = valueObject(options[options.length - 1]);
					scrollIntoView(null, options.length - 1);
				} else {
					let activeItemIndex = valueAsObject
						? options.indexOf(activeItem)
						: options.findIndex((o) => o[valueField] === activeItem);
					if (activeItemIndex === 0) {
						activeItem = valueObject(options[options.length - 1]);
						scrollIntoView(null, options.length - 1);
					} else {
						activeItem = valueObject(options[activeItemIndex - 1]);
						scrollIntoView(null, activeItemIndex - 1);
					}
				}
			}
		} else if (e.key === "Enter") {
			if (activeItem !== null && dropdownOpen) {
				itemSelect(activeItem);
			} else if (!dropdownOpen) {
				dropdownOpen = true;
				focused = true;
			}
		} else if (e.key === "Backspace") {
			if (searchInput === null || searchInput === "") {
				if (multiple && value.length > 0) {
					value = value.slice(0, -1);
				}
			}
		} else if (e.key.length === 1) {
			if (searchInput === null) {
				searchInput = e.key;
			} else {
				searchInput += e.key;
			}
		}
	}

	function clickHandler(e) {
		console.log("clickHandler", e);
		if (!dropdownEl.contains(e.target)) {
			console.log("clickHandler 1");
		} else {
			console.log("clickHandler 2");
		}
	}

	$: if (dropdownOpen) {
		document.addEventListener("keydown", keyboardHandler);
	} else {
		document.removeEventListener("keydown", keyboardHandler);
		dropdownExtraHeight.set(0);
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
		}, 200);
	}

	$: console.log($dropdownExtraHeight);
</script>

<div
	class="select-container"
	class:disabled
	class:noFill
	style:position={dropdownRelative ? "unset" : "relative"}
>
	<div
		class="select-control"
		class:focused
		tabindex="0"
		use:clickOutside
		on:outclick={() => {
			dropdownOpen = false;
			focused = false;
		}}
		on:click={() => {
			dropdownOpen = !dropdownOpen;
			focused = !focused;
		}}
		on:focusin={() => {
			document.addEventListener("keydown", keyboardHandler);
		}}
		on:focusout={() => {
			document.removeEventListener("keydown", keyboardHandler);
		}}
	>
		{#if fieldIcon}
			<div class="field-icon">
				<Icon
					icon={fieldIcon}
					size={16}
					color="gray"
				/>
			</div>
		{/if}
		{#if value === null || value.length === 0}
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
				{#if placeholder}
					<div class="placeholder-text">
						{placeholder}
					</div>
				{/if}
			</div>
		{:else if multiple}
			{#each value as v (v)}
				{@const item = options.find((o) => valueObject(o) === v)}
				<div
					class="select-item control-item multiple {itemStyle}"
					class:minimalControl
					animate:flip={{ duration: 200 }}
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

					<div class="select-item-close"
						on:click={(e) => {
						e.stopPropagation();
						itemRemove(v)
						}
					}
					>
						<Icon
							icon="close"
							size={12}
						/>
					</div>
				</div>
			{/each}
		{:else if value}
			{@const item = options.find((o) => valueObject(o) === value)}
			<div
				class="select-item control-item"
				class:minimalControl
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
					{item[labelField]}
				{/if}
			</div>
		{/if}
		{#if value && clearable}
			<div class="clear-button">
				<Button
					icon="close"
					size="sm"
					color="red"
					style="minimal"
					on:click={(e) => {
						e.stopPropagation();
						value = null;
					}}
				/>
			</div>
		{/if}
		<div class="select-arrow">
			<Icon
				icon="chevronRight"
				size={16}
				color="gray"
			/>
		</div>
	</div>
	{#if dropdownOpen}
		<div
			class="select-dropdown"
			transition:slide={{ duration: 200 }}
			bind:this={dropdownEl}
		>
			{#if isGrouped}
				{#each options as group, i}
					<div class="select-group">
						<div class="select-group-header">
							{group[groupHeaderField]}
						</div>
						<div class="select-group-items">
							{#each group[groupItemsField] as item, i}
								<div
									class="select-item dropdown-item {itemStyle}"
									on:click={() => itemSelect(valueObject(item))}
									class:active={valueObject(item) === activeItem}
									on:mouseenter={() => (activeItem = valueObject(item))}
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
							{/each}
						</div>
					</div>
				{/each}
			{:else if options !== null || options.length !== 0}
				{#each options as item}
					<div
						class="select-item dropdown-item {itemStyle}"
						on:click={() => itemSelect(valueObject(item))}
						class:active={valueObject(item) === activeItem}
						on:mouseenter={() => (activeItem = valueObject(item))}
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
							{item[labelField]}
						</div>
					</div>
				{/each}
			{:else}
				<div class="select-item">No options</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	@use "../../../style/global" as *;

	.select-container {
		width: 100%;
		&.noFill {
			width: auto;
		}
		.select-item {
			display: flex;
			align-items: center;
			margin-right: 0.5rem;
			padding: $p6;
			box-sizing: border-box;
			border-radius: var(--border-radius);
			@include ui-text(var(--text), $p14, 500);
			cursor: pointer;
			transition: background-color 0.1s ease;
			&.active {
				background-color: var(--bg-secondary);
			}
			&.select {
				background-color: var(--blue);
				color: var(--white);
				width: fit-content;
				padding: $p3 $p8;
				&:not(:last-child) {
					margin-bottom: $p6;
				}
			}
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
			}
			.select-item-label {
				margin-right: 0.5rem;
			}
		}
		.select-control {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 0 $p12;
			border: 1px solid var(--border-color);
			border-radius: $border-radius;
			background-color: var(--bg-secondary);
			min-height: $p42;
			width: 100%;
			box-sizing: border-box;
			&:focus-visible {
				border: 1px solid var(--blue);
				outline: none;
			}
			.control-item {
				width: 100%;
				padding-left: $p6;
				&.multiple {
					width: auto;
					height: fit-content;
					padding: $p6;
					box-sizing: border-box;
					background-color: var(--blue);
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
				}
			}

			.field-icon {
				margin-right: 0.5rem;
			}
			.placeholder {
				@include flex(row, flex-start, center);
				display: flex;
				align-items: center;
				margin-right: auto;
				.placeholder-text {
					@include ui-text(var(--text-secondary), $p14, 500);
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
			}
			.select-arrow {
				margin-left: 0.5rem;
				transition: $transition;
			}
			&.focused {
				border-color: var(--blue);
				box-shadow: 0 0 0 3px var(--blue-light);
				.select-arrow {
					transform: rotate(90deg);
				}
			}
			&:hover {
				.clear-button {
					opacity: 1;
				}
			}
		}
		.select-dropdown {
			@include scrollbar();
			position: absolute;
			top: 100%;
			left: 0;
			width: 100%;
			max-height: 20rem;
			overflow-y: overlay;
			border: 1px solid var(--border-color);
			border-radius: var(--border-radius);
			background-color: var(--bg);
			box-sizing: border-box;
			margin-top: $p8;
			box-shadow: 0 $p2 $p8 0 var(--shadow-color);
			padding: $p6;
			transform-origin: top center;
			z-index: 15;
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
		}
	}
</style>
