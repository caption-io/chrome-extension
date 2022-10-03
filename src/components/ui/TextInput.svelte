<script lang="ts">
	import Tooltip from "./Tooltip.svelte";
	import Icon from "./Icon.svelte";
  import { replace } from "lodash-es";
  import {fade} from 'svelte/transition';
  import Select from "./Select.svelte";

	export let placeholder: string = "";
	export let type: string;
	export let inputIcon: Icons | null = null;
	export let labelText: string = null;
	export let labelIcon: Icons = null;
	export let value: string;
	export let option: NotionProp = null;
	export let webDataSelect: boolean = false;

	const inputType =
		type === "text" || type === "title"
			? "text"
			: type === "phone_number"
			? "tel"
			: type === "email"
			? "email"
			: type === "url" || type === "files"
			? "url"
			: type === "number"
			? "number"
			: type === "password"
			? "password"
			: "text";

	let focused: boolean = false;
	let invalid: boolean = false;

	function typeAction(node) {
		node.type = inputType;
	}

	function validCheck(el) {
		invalid = el.target.validity.typeMismatch;
	}
</script>

<div class="main">
	{#if labelText}
		<div class="input-label">
			{#if labelIcon}
				<Icon
					name={labelIcon}
					size="med"
					position="left"
					color="grey"
					light={true}
					link={false}
				/>
			{/if}
			<label for={option ? option.id : "null"} class="label-text">
				<h3>{labelText}</h3>
			</label>
		</div>
	{/if}
	<div class={`input-container${focused ? " focused" : ""}${invalid && focused ? ' invalid' : ''}`}>
		{#if webDataSelect}
		<div />
		{/if}
		{#if inputIcon}
			<Icon name={inputIcon} color={"grey"} position="left" />
		{/if}
		<input
			name={option ? option.id : "null"}
			class="text-input"
			use:typeAction
			bind:value
			wrap="soft"
			{placeholder}
			on:focus={() => (focused = true)}
			on:blur={() => (focused = false)}
			on:input={(e) => validCheck(e)}
		/>
	</div>
	{#if invalid && focused}
		<Tooltip
			value={inputType === "url" ? "May not be a valid URL" : `May not be a valid ${option.type.replace(/_/g, " ")}.`}
			position="bottom-right"
			show={invalid}
		/>
	{/if}
</div>

<style lang="scss">
	@use "../../style/global" as *;

	.main {
		@include flex(column, flex-start, flex-start);
		@include inputLabel();
		width: 100%;
		position: relative;
		.input-container {
			@include flex(row, flex-start, center);
			min-height: 2.25rem;
			border: 1px solid var(--border-color);
			@include input-shadow();
			border-radius: 4px;
			box-sizing: border-box;
			padding: 0 0.5rem;
			background: var(--white);
			transition: 200ms;
			width: 100%;
			&.focused {
				box-shadow: 0 0 0 3px var(--blue-light);
				border: 1px solid var(--blue);
			}
			&.invalid {
				box-shadow: 0 0 0 3px var(--yellow-light);
				border: 1px solid var(--yellow);
			}
			.text-input {
				width: 100%;
				outline: none;
				border: none;
				background: transparent;
				font-family: var(--font-family);
				font-weight: 400;
				font-size: 0.875rem;
				min-height: 36px;

				&.colored {
					color: var(--blue-dark);
				}
				&::placeholder {
					color: var(--text-light);
					opacity: 0.75;
				}
			}
		}
	}
</style>
