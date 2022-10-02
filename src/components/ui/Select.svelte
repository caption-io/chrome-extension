<script lang="ts">
	import Icon from "./Icon.svelte";
	import Svelecte, { addFormatter } from "svelecte";
	import {fade} from 'svelte/transition';
	import { webData } from "../../scripts/stores";
	import {
		WithIcon,
		SimpleSelect,
		NStatus,
		NMultiSelect,
	} from "../../scripts/svelecte-renderers";

	export let options: NotionSelectOption[] | NotionStatusOption[];
	export let type: NotionPropTypes | string;
	export let labelText: string = null;
	export let labelIcon: Icons = null;
	export let clearable: boolean = false;

	console.log("Prop Options: ", options, type);

	addFormatter("with_icon", WithIcon);
	addFormatter("select", SimpleSelect);
	addFormatter("status", NStatus);
	addFormatter("multi_select", NMultiSelect);

</script>

<div class="main" in:fade={{duration: 400, delay: 200}}>
	{#if labelText}
		<div class="input-label">
			{#if labelIcon}
				<div class="label-icon">
					<Icon
						name={labelIcon}
						link={false}
						size="med"
						position="left"
						color="grey"
						light={true}
					/>
				</div>
			{/if}

			<div class="label-text">
				<h3>{labelText}</h3>
			</div>
		</div>
	{/if}

	<div class="select-container">
		<Svelecte
			{options}
			renderer={type}
			multiple={type === "multi" || type === "multi_select" ? true : false}
			{clearable}
			valueField="id"
			labelField="name"
			groupLabelField="groupHeader"
			groupItemsField="options"
		/>
	</div>
</div>

<style lang="scss">
	@use "../../style/global" as *;
	.main {
		@include flex(column, flex-start, flex-start);
		@include inputLabel();
		width: 100%;
		.select-container {
			width: 100%;
		}
	}
</style>
