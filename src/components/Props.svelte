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
	import {fade} from 'svelte/transition';

	export let options: NotionProp[];
	export let values: NotionProp[] = options;


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
	];

	const propDefaultSort = [
		"title",
		"url",
		"pageIcon",
		"coverImage",
		"select",
		"multi_select",
		"checkbox",
		"date",
		"rich_text",
		"number",
		"people",
		"files",
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

	// sort options by propDefaultSort
	options.sort((a, b) => {
		return (
			propDefaultSort.indexOf(a.type) -
			propDefaultSort.indexOf(b.type)
		);
	});
	
	const isIcon = (p: NotionPropTypes | Icons): p is Icons => {
		return (p as Icons) !== undefined;
	}

	addFormatter("select", SimpleSelect);
	addFormatter("multiselect", NMultiSelect);
	addFormatter("status", NStatus);
</script>

<div class="main props-main">
	{#each options as option (option.id)}
		{#if !readOnly.includes(option.type)}
			<div class="prop-container">
				<div class="prop-input">
					{#if selects.includes(option.type)}
						<Select
							options={option.options}
							type={option.type}
							labelText={option.name}
							labelIcon={isIcon(option.type) ? option.type : null}
							clearable={true}
							
						/>
					{:else if textInputs.includes(option.type)}
						<TextInput
							type={option.type}
							option={option}
							labelText={option.name}
							labelIcon={isIcon(option.type) ? option.type : null}
							bind:value={values[values.findIndex(o => o.name === option.name)].storedValue}
						/>
					{:else if option.type === "checkbox"}
						<div class="checkbox">
							<input type="checkbox" />
							<label>{option.name}</label>
						</div>
						{:else if option.type === "date"}
						<DateTime type="datetime" labelIcon={option.type} labelText={option.name} includeEnd={true} />
					{:else}
						<div class="prop-type" in:fade={{duration: 400, delay: 200}}>{option.type}</div>
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
