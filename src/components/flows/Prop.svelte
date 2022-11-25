<script lang="ts">
	import PropLabel from "./flow-editor/PropLabel.svelte";
	import TextInput from "src/components/ui/TextInput.svelte";
	import Select from "src/components/ui/Select.svelte";
	import DateTime from "src/components/ui/DateTime.svelte";
	import Toggle from "src/components/ui/Boolean.svelte";
	import InputData from "./InputData.svelte";

	import { _flows } from "src/scripts/platform/platform";
	import { selectedFlow, onLoadInputData } from "src/scripts/platform/stores";
	import { propData } from "src/scripts/platform/default_settings";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let prop: FlowProp;
	export let visible = true;
	export let inputData;
	export let propValue = null;

	let showPropSettings = false;
	let showInputData = false;
	let hovered = false;
	let pendingChanges = {
		value: false,
		state: "never",
	};
	let saveState = "never";

	$: prop.value = propValue;

	const isIcon = (p: FlowProp["type"] | Icons): p is Icons => {
		return (p as Icons) !== undefined;
	};
	function isInputGroups(data: any): data is InputGroup[] {
		return data.length !== 0;
	}

	if (prop.savedValue) {
		propValue = prop.savedValue;
		saveState = "value";
	} else if (prop.savedInput) {
		let pData = $onLoadInputData.find(
			(i) => i.id === prop.savedInput.inputItemProvider.id
		).data;
		if (isInputGroups(pData)) {
			let group = pData.find(
				(g) => g.label === prop.savedInput.inputItemGroup.label
			);
			let exactSource = group.items.find((i) =>
				i.source.some((s) => prop.savedInput.inputItem.source.includes(s))
			);
			let unexactSource = group.items[0];
			let item = exactSource
				? exactSource
				: unexactSource
				? unexactSource
				: null;
			if (item) {
				propValue = item.item;
			}
		}
		saveState = "input";
	} else {
		saveState = "never";
	}

	// FUNCTIONS: Event handlers

	function handleOptionClick(message) {
		if (message === "visible") {
			prop.visible = !prop.visible;
			_flows.updateProp($selectedFlow.id, prop.id, "visible", prop.visible).then(
				() => {
					dispatch("vischange", prop);
				}
			);
			return;
		} else if ((message = "settings")) {
			showPropSettings = !showPropSettings;
		}
		if ((message = "inputdata")) {
			showInputData = !showInputData;
		}
	}

	function handlePropSaveState(e) {
		saveState = e.detail;
		if (e.detail === "value") {
			_flows
				.updateProp($selectedFlow.id, prop.id, "savedValue", propValue)
				.then(() => {
					_flows.updateProp($selectedFlow.id, prop.id, "savedInput", null);
				});
				prop.savedValue = propValue;
				prop.savedInput = null;
			return;
		} else if (e.detail === "input") {
			_flows
				.updateProp($selectedFlow.id, prop.id, "savedInput", inputData)
				.then(() => {
					_flows.updateProp($selectedFlow.id, prop.id, "savedValue", null);
				});
				prop.savedInput = inputData;
				prop.savedValue = null;
			return;
		} else if (e.detail === "never") {
			_flows
				.updateProp($selectedFlow.id, prop.id, "savedInput", null)
				.then(() => {
					_flows.updateProp($selectedFlow.id, prop.id, "savedValue", null);
				});
				prop.savedInput = null;
				prop.savedValue = null;
			return;
		}
		pendingChanges = {
			value: false,
			state: saveState,
		};
	}

	function handleInputChange(e) {
		if (prop.savedInput) {
			if (
				prop.savedInput.inputItemGroup.label !==
					e.detail.inputItemGroup.label ||
				prop.savedInput.inputItem.source.some(
					(s) => !e.detail.inputItem.source.includes(s)
				)
			) {
				pendingChanges = {
					value: true,
					state: "input",
				};
			} else {
				pendingChanges = {
					value: false,
					state: saveState,
				};
			}
		}
		inputData = e.detail;
		propValue = e.detail.inputItem.item;
		showInputData = false;
	}

	$: if (propValue && !prop.savedInput) {
		if (prop.savedValue && prop.savedValue !== propValue) {
			pendingChanges = {
				value: true,
				state: "value",
			};
		} else {
			pendingChanges = {
				value: false,
				state: saveState,
			};
		}
	}

	//! FUNCTIONS
</script>

<div
	class="prop-container"
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
>
	<PropLabel
		text={prop.name}
		icon={isIcon(prop.type) ? prop.type : null}
		{hovered}
		on:optionclick={(e) => handleOptionClick(e.detail)}
		bind:visible
		{inputData}
		{propValue}
		on:save={(e) => {
			handlePropSaveState(e);
			pendingChanges = {
				value: false,
				state: saveState,
			};
		}}
		{saveState}
		bind:pendingChanges
		bind:prop
	/>
	<div class="prop-input">
		{#if propData.selectProps.includes(prop.type)}
			<Select
				options={prop.options}
				groupHeaderField={prop.type === "status" ? "groupHeader" : null}
				groupItemsField={prop.type === "status" ? "options" : null}
				multiple={prop.type === "multi_select" ? true : false}
				itemStyle={prop.type === "status"
					? "select"
					: prop.type === "select" || prop.type === "multi_select"
					? "select"
					: "default"}
			/>
		{:else if propData.textInputProps.includes(prop.type)}
			<TextInput
				{prop}
				bind:value={propValue}
			/>
		{:else if prop.type === "date"}
			<!-- <DateTime {prop} /> -->
			Date Time
		{:else if prop.type === "checkbox"}
			<Toggle {prop} />
		{:else if propData.readOnlyProps.includes(prop.type)}
			<div class="read-only">
				{prop.name}
			</div>
		{:else}
			<div class="read-only">
				{prop.type}
			</div>
		{/if}
	</div>
	{#if showInputData}
		<InputData
			{prop}
			savedInput={null}
			on:selected={(e) => {
				handleInputChange(e);
			}}
		/>
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;
:global() {
	.prop-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		box-sizing: border-box;
		position: relative;
		.prop-input {
			padding: $p6 0 $p6 0;
		}
	}
}
</style>
