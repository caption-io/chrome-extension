<script lang="ts">
	import Icon from "./ui/Icon.svelte";
	import { add, includes, valuesIn } from "lodash-es";
	import TextInput from "./ui/TextInput.svelte";
	import Select from "./ui/Select.svelte";
	import Svelecte from "svelecte";
	import DateTime from "./ui/DateTime.svelte";
	import SveltyPicker from "svelty-picker";
	import { addFormatter, config } from "svelecte";
	import {
		NMultiSelect,
		NStatus,
		SimpleSelect,
	} from "../scripts/svelecte-renderers";
	import { queryDatabase } from "../scripts/api-endpoints";
	import { isFullPage } from "@notionhq/client";

	export let options: SvelecteOption[];

	let selects = ["select", "multi_select", "status"];
	let textInputs = [
		"title",
		"rich_text",
		"number",
		"email",
		"phone_number",
		"url",
		"file",
	];
	let readOnly = [
		"formula",
		"created_time",
		"last_edited_time",
		"created_by",
		"last_edited_by",
		"rollup",
		"people",
	];

	const propDefaultSort = [
		"title",
		"select",
		"multi_select",
		"checkbox",
		"date",
		"rich_text",
		"number",
		"people",
		"files",
		"url",
		"email",
		"phone_number",
		"relation",
		"status",
		"formula",
		"created_time",
		"last_edited_time",
		"created_by",
		"last_edited_by",
		"rollup",
	];

	// if any sv-dropdowns are not completely visible, scroll to them
	
		

	addFormatter("select", SimpleSelect);
	addFormatter("multiselect", NMultiSelect);
	addFormatter("status", NStatus);
</script>

<div class="main props-main">
	{#each options as option (option.value)}
		{@const propType = option.extras.type}
		{#if !readOnly.includes(propType)}
			<div class="prop-container">
				<div class="prop-input">
					{#if selects.includes(propType)}
						<Select
							options={option.extras.options}
							type={propType}
							labelText={option.text}
							labelIcon={propType}
							clearable={true}
							
						/>
					{:else if textInputs.includes(propType)}
						<TextInput
							type={propType}
							labelText={option.text}
							labelIcon={propType}
							value=""
						/>
					{:else if propType === "checkbox"}
						<div class="checkbox">
							<input type="checkbox" />
							<label>{option.text}</label>
						</div>
						{:else if propType === "date"}
						<DateTime type="datetime" labelIcon={propType} labelText={option.text} includeEnd={true} />
					{:else}
						<div class="prop-type">{propType}</div>
					{/if}
				</div>
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	@use "../style/global" as *;

	.main {
		overflow: auto;
		flex-grow: 1;
		@include scrollbar();
		padding: 0 0 0.5rem 0;
	}

	.prop-container {
		margin: 0.75rem;
		box-sizing: border-box;
	}

	.prop-label {
		@include flex("row", "flex-start", "center");
		margin: 0 0 0.25rem 0.175rem;
		> h3 {
			@include h3();
			flex-grow: 1;
		}
	}

	.prop-input {
		@include flex("row", "flex-start", "center");
		> div {
			flex-grow: 1;
		}
	}
</style>
