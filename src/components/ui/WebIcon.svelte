<script lang="ts">
	import Icon from "./Icon.svelte";
	import TextInput from "./TextInput.svelte";
	import {scaleFromTop} from '../../scripts/ui-utils';

	let webIcon: string = null;
	browser.storage.local.get("pageData").then((res) => {
		webIcon = res.pageData.icon;
	});
	export let type: "webicon" | "custom" | "none" = webIcon
		? "webicon"
		: "none";
	export let labelText: string = null;
	export let labelIcon: Icon = null;
	export let value;
</script>

<div class="main" style={`height: ${type === "custom" ? "129px" : "85px"}`}>
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
	<div class="option-container">
		<div
			class={`option webicon ${type === "webicon" ? "selected" : ""}`}
			on:click={() => (type = "webicon")}
		>
			<Icon url={webIcon} />
			<div class="option-text">Web Icon</div>
		</div>
		<div
			class={`option custom ${type === "custom" ? "selected" : ""}`}
			on:click={() => (type = "custom")}
		>
			<Icon name="url" color="grey" light={true}/>
			<div class="option-text">Custom URL</div>
		</div>
		<div
			class={`option none ${type === "none" ? "selected" : ""}`}
			on:click={() => (type = "none")}
		>
			<Icon name="none" color="grey" light={true}/>
			<div class="option-text">None</div>
		</div>
	</div>
	{#if type === "custom"}
		<div class="custom-url">
			<TextInput
				placeholder="https://"
				type="url"
				bind:value={value}
			/>
		</div>
	{/if}
</div>

<style lang="scss">
	@use "../../style/global" as *;

	@keyframes scaler {
		from {
			height: 0px;
		}
		to {
			height: 36px;
		}
	}
.main {
	@include flex(column, flex-start, flex-start);
	@include inputLabel();
	width: 100%;
	overflow: hidden;
	transition: 200ms ease;
	.option-container {
		@include flex(row, flex-start, flex-start);
		width: 100%;
		padding: 0.35rem;
		border-radius: var(--border-radius);
		border: 1px solid var(--border-color);
		background-color: var(--bg);
		box-sizing: border-box;
		@include input-shadow();

		.option {
			@include flex(column, center, center);
			@include inputLabel();
			width: 100%;
			height: 100%;
			padding: 0.25rem;
			border-radius: 0.25rem;
			cursor: pointer;
			box-sizing: border-box;
			transition: 200ms ease;
			&:hover {
				background-color: var(--bg-dark);
			}
			&.selected {
				background-color: var(--bg-dark);
			}
			.option-text {
				margin-top: 0.5rem;
			}
		}
	}
	.custom-url {
		width: 100%;
		margin-top: 0.25rem;
	}
}
</style>
