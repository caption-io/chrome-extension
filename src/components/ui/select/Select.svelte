<script lang="ts">
	import Svelecte, { addFormatter } from "svelecte";
	import Icon from "src/components/ui/Icon.svelte";
	import NotionSelect from "./NotionSelect.svelte";
	export let options:
		| NotionSelectOption[]
		| NotionStatusOption[]
		| NotionDatabase[]
		| [];
	export let type: NotionPropTypes | string;
	export let clearable: boolean = false;
	export let placeholder = "Select...";
	export let disabled: boolean = false;
	export let value;
	export let searchable: boolean = true;
	export let valueAsObject: boolean = false;
	export let label: string = null;
	export let labelIcon: Icons = null;
	console.log("Recieved Type is: ", type);
</script>

<div class="main">
	<div class="select-container">
		{#if label}
			<div
				class="label"
				class:disabled
			>
				{#if labelIcon}
					<Icon
						name={labelIcon}
						size={12}
						color="gray-500"
						position="l"
					/>
				{/if}
				{label}
			</div>
		{/if}
		<Svelecte
			{options}
			dropdownItem={NotionSelect}
			controlItem={NotionSelect}
			class={"sv-notion-select"}
			multiple={type === "multi" || type === "multi_select" ? true : false}
			{clearable}
			valueField="id"
			labelField="name"
			groupLabelField="groupHeader"
			groupItemsField="options"
			{placeholder}
			{disabled}
			{searchable}
			{valueAsObject}
			bind:value
		/>
	</div>
</div>

<style lang="scss">
	@use "../../../style/global" as *;

	@mixin iconReplace($url, $size) {
		padding: 0 !important;
		margin: 0 !important;

		svg {
			display: none;
		}
		&::after {
			content: "";
			background-image: url($url);
			font-size: 0.75rem;
			color: var(--text-color);
			height: $size;
			width: $size;
			box-sizing: border-box;
			background-size: cover;
			background-position: center center;
			opacity: 0.55;
			&:hover {
				background-color: var(--red-50);
			}
		}
	}
	.main {
		@include flex(column, flex-start, flex-start);
		width: 100%;
		.select-container {
			width: 100%;
			position: relative;
			.label {
				@include flex(row, flex-start, center);
				@include ui-text(var(--gray-500), 0.75rem, 500);
				padding: 2px 4px;
				position: absolute;
				border-radius: $border-radius;
				top: -11px;
				left: $p8;
				z-index: 1;
				background-color: var(--white);
				.disabled {
					color: var(--gray-300);
					background-color: var(--gray-100);
				}
			}
		}
	}
	:global {
		.svelecte {
			width: 100%;

			&.svelecte-control {
				--sv-border-color: var(--gray-300);
				--sv-dropdown-height: 300px;
			}
			.sv-control {
				transition: 300ms ease;
				padding-right: $p6 !important;
				border-radius: $border-radius;
				min-height: $p40;
				box-shadow: $input-shadow;
				border: $border-dark;
				.inputBox {
					padding-left: $p8;
					width: fit-content !important;
					box-sizing: border-box;
				}
				.indicator {
					.indicator-container:not(.close-icon) {
						@include iconReplace("/icons/chevron-down.svg", 1.25rem);
						transform: rotate(-90deg);
						transition: $transition;
					}
					.indicator-separator {
						background-color: var(--gray-300) !important;
						margin: 0.5rem 0.5rem !important;
					}
					.close-icon {
						@include iconReplace("/icons/close.svg", 1rem);
					}
				}
				&.is-active {
					border: $border-color var(--blue-400);
					box-shadow: $input-shadow, 0 0 0 3px var(--blue-100);
					outline: none !important;

					.indicator-container:not(.close-icon) {
						transform: rotate(0deg);
					}
				}
			}
			.sv-dropdown {
				bottom: unset !important;
				left: 0 !important;
				margin-top: 0.25rem;
				padding: 0 !important;
				max-height: 350px;
				box-shadow: $input-shadow, 0 0 2rem 0 rgba(0, 0, 0, 0.2) !important;
				transition: 300ms ease;
				border-radius: $p6 !important;
				border: $border-dark !important;
			}
		}
	}
</style>
