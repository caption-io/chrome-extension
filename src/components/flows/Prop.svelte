<script lang="ts">
	import InputLabel from "../ui/InputLabel.svelte";
	import TextInput from "src/components/ui/TextInput.svelte";
	import Select from "src/components/ui/select/Select.svelte";
	import DateTime from "src/components/ui/DateTime.svelte";
	import Toggle from "src/components/ui/Toggle.svelte";

	import { _flows } from "src/scripts/platform/platform";
	import { selectedFlow } from "src/scripts/platform/stores";
	import InputData from "./InputData.svelte";

	export let prop: Prop;

	let showPropSettings = false;
	let showInputData = false;
	let hovered = false;
	export let visible = true;

	let selects = ["select", "multi_select", "status"];
	let textInputs = [
		"title",
		"rich_text",
		"number",
		"email",
		"phone_number",
		"url",
		"files",
	];
	let readOnly = [
		"formula",
		"created_time",
		"last_edited_time",
		"created_by",
		"last_edited_by",
		"rollup",
		"people",
		"pageIcon",
		"coverImage",
	];

	function handleOptionClick(message) {
		console.log("input label says: ",message);
		if (message === "visible") {
			prop.visible = !prop.visible;
			_flows.updateProp($selectedFlow.id, prop.id, "visible", prop.visible);
		} else if ((message = "settings")) {
			showPropSettings = !showPropSettings;
		}
		if ((message = "inputdata")) {
			showInputData = !showInputData;
			console.log("show input data: ", showInputData);
		}
	}

	$: console.log("showinputdata: ", showInputData);

	const isIcon = (p: Prop["type"] | Icons): p is Icons => {
		return (p as Icons) !== undefined;
	};
</script>

<div
	class="prop-container"
	on:mouseenter={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
>
	<InputLabel
		text={prop.name}
		icon={isIcon(prop.type) ? prop.type : null}
		{hovered}
		on:optionclick={(e) => handleOptionClick(e.detail)}
		bind:visible
	/>
	<div class="prop-input">
		{#if selects.includes(prop.type)}
			<Select options={prop.options} />
		{:else if textInputs.includes(prop.type)}
			<TextInput {prop} />
		{:else if prop.type === "date"}
			<DateTime {prop} />
		{:else if prop.type === "checkbox"}
			<Toggle {prop} />
		{:else if readOnly.includes(prop.type)}
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
		<InputData prop={prop}/>
	{/if}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	.prop-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		box-sizing: border-box;
		position: relative;
		.prop-input {
			padding: $p12 0 $p6 0;
		}
	}
</style>
