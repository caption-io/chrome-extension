<script lang="ts">
	import Icon from "./Icon.svelte";
	import Svelecte, { addFormatter } from "svelecte";
	import { webData } from "../../scripts/stores";
	import {
		WithIcon,
		SimpleSelect,
		NStatus,
		NMultiSelect,
	} from "../../scripts/svelecte-renderers";

	export let options: SvelecteOption | (() => SvelecteOption);
	export let type: SvelecteRenderer;
	export let labelText: string = null;
	export let labelIcon: Icons = null;
	export let clearable: boolean = false;

	addFormatter("with_icon", WithIcon);
	addFormatter("select", SimpleSelect);
	addFormatter("status", NStatus);
	addFormatter("multi_select", NMultiSelect);

</script>

<div class="main">
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
			groupLabelField="groupHeader"
			groupItemsField="items"
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
