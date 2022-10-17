<script lang="ts">
	import WebIcon from "src/components/ui/WebIcon.svelte";
	import TextInput from "src/components/ui/TextInput.svelte";
	import Select from "src/components/ui/select/Select.svelte";
	import DateTime from "src/components/ui/DateTime.svelte";
	import { fade } from "svelte/transition";
	import { flip } from "svelte/animate";

	import { maxSize } from "src/scripts/platform/stores";
	export let options: NotionProp[];
	export let values: NotionProp[] = options;
	export let value = null;

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
		"status",
		"number",
		"people",
		"files",
		"email",
		"phone_number",
		"relation",
		"formula",
		"created_time",
		"last_edited_time",
		"created_by",
		"last_edited_by",
		"rollup",
	];

	// sort options by propDefaultSort
	options.sort((a, b) => {
		return propDefaultSort.indexOf(a.type) - propDefaultSort.indexOf(b.type);
	});

	const isIcon = (p: NotionPropTypes | Icons): p is Icons => {
		return (p as Icons) !== undefined;
	};
</script>

<div
	class="main props-main"
	style:maxHeight={$maxSize.height - 36 + "px"}
>
	{#each options as option, i (option.id)}
		{#if !readOnly.includes(option.type)}
			<div
				class="prop-container"
				in:fade={{ duration: 400, delay: 200 }}
			>
				<!-- <InputLabel text={option.name} icon={option.type} /> -->
				<div class="prop-input">
					{#if selects.includes(option.type)}
						<Select
							options={option.options}
							type={option.type}
							clearable={true}
							value={null}
							label={option.name}
						/>
					{:else if textInputs.includes(option.type)}
						<TextInput
							type={option.type}
							{option}
							bind:value={values[
								values.findIndex((o) => o.name === option.name)
							].storedValue}
						/>
					{:else if option.type === "checkbox"}
						<div class="checkbox">
							<input type="checkbox" />
							<label>{option.name}</label>
						</div>
					{:else if option.type === "date"}
						<DateTime
							type="datetime"
							includeEnd={true}
						/>
					{:else if option.type === "relation"}
						<div
							class="prop-type"
							in:fade={{ duration: 400, delay: 200 }}
						>
							{option.type}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	{/each}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	.main {
		@include flex(column, flex-start, flex-start);
		@include scrollbar();
		overflow-y: auto;
		overflow-x: hidden;
		flex-grow: 1;
		background-color: var(--bg);
		row-gap: $p24;
		width: 100%;
		border-top: $border-light;
		& > :first-child {
			padding-top: $p24;
		}
		& > :last-child {
			padding-bottom: $p16;
		}
	}

	.tabs {
		width: 100%;
		position: sticky;
		top: 0;
	}

	.prop-container {
		padding: 0 $p12;
		box-sizing: border-box;
		width: 100%;
	}

	.prop-label {
		@include flex("row", "flex-start", "center");
		margin: 0 0 0.25rem 0.175rem;
		> h3 {
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
