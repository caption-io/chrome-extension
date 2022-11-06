<script lang="ts">
	import Prop from "src/components/flows/Prop.svelte";
	import Icon from "src/components/ui/Icon.svelte";
	import { crossfade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { quintOut } from "svelte/easing";
	import { includes } from "lodash-es";

	export let options: Prop[];
	export let values: Prop[] = options;
	export let value = null;

	let showMore = false;

	const [send, receive] = crossfade({
		duration: 400,
		easing: quintOut,
	});

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
	$: options.filter((p) => {
		return p.visible;
	});
</script>

<div class="main props-main">
	{#each options.filter((o) => o.visible && !readOnly.includes(o.type)) as prop, i (prop.id)}
		<div
			class="prop"
			in:receive={{ key: prop.id }}
			out:send={{ key: prop.id }}
			animate:flip={{ duration: 400 }}
		>
			<Prop
				bind:prop
				flip={{ duration: 200 }}
				bind:visible={prop.visible}
			/>
		</div>
	{/each}
	<div class="show-more">
		<div
			class="show-more-button"
			on:click={() => (showMore = !showMore)}
		>
			Show More
			<div
				class="icon"
				class:showMore
			>
				<Icon
					icon="chevronRight"
					color="gray"
					size={16}
				/>
			</div>
		</div>
		<div
			class="show-more-content"
			style:height={showMore ? "auto" : "0px"}
		>
			{#each options.filter((o) => !o.visible) as prop, i (prop.id)}
				<div
					class="prop"
					in:receive={{ key: prop.id }}
					out:send={{ key: prop.id }}
					animate:flip={{ duration: 400 }}
				>
					<Prop bind:prop />
				</div>
			{/each}
		</div>
	</div>
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
		row-gap: $p12;
		width: 100%;
		border-top: $border-light;
		padding: $p16 $p12;
		box-sizing: border-box;
		margin-top: $p12;
		box-shadow: 0 $p12 $p12 0 var(--shadow-color-light) inset;
		height: 100%;
	}

	.prop {
		width: 100%;
	}

	.show-more {
		@include flex(column, flex-start, flex-start);
		width: 100%;
		.show-more-button {
			@include flex(row, center, center);
			@include ui-text(var(--text-secondary), $p14, 500);
			padding: $p6 0;
			width: 100%;
			cursor: pointer;
			transition: $transition;
			&:hover {
				background-color: var(--bg);
			}
			.icon {
				transform: rotate(90deg);
				transition: $transition;
				&.showMore {
					transform: rotate(-90deg);
				}
			}
		}
		.show-more-content {
			@include flex(column, flex-start, flex-start);
			overflow: hidden;
			transition: height 0.2s ease-in-out;
			row-gap: $p12;
			width: 100%;
			box-sizing: border-box;
		}
	}

	.tabs {
		width: 100%;
		position: sticky;
		top: 0;
	}

	.prop-container {
		padding: $p12 $p12;
		box-sizing: border-box;
		width: 100%;
		position: relative;
		border-radius: var(--border-radius);
		background-color: var(--bg);
	}

	.prop-label {
		@include flex(row, flex-start, center);
		margin: 0 0 0.25rem 0.175rem;
		> h3 {
			flex-grow: 1;
		}
	}

	.prop-input {
		@include flex(row, flex-start, center);
		column-gap: $p6;
		> div {
			flex-grow: 1;
		}
	}
</style>
