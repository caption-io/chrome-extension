<script lang="ts">
	import Prop from "src/components/flows/Prop.svelte";
	import Icon from "src/components/ui/Icon.svelte";

	import { crossfade } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { dndzone } from "svelte-dnd-action";
	import { quintOut } from "svelte/easing";
	import {createEventDispatcher} from "svelte";

	import { maxSize, selectedFlow } from "src/scripts/platform/stores";
	import { _flows } from "src/scripts/platform/platform";
	import { propData } from "src/scripts/platform/default_settings";

	export let options: FlowProp[];
	export let values = optionsSorter();

	let showMore = false;

	const dispatch = createEventDispatcher();

	$: if (values) {
		dispatch("propvaluechange", values);
	}


	const [send, receive] = crossfade({
		duration: 400,
		easing: quintOut,
	});

	function optionsSorter() {
		if ($selectedFlow.defaultDestination.defaultSort) {
			return {
				visible: options.filter(
					(o) =>
						o.visible &&
						!o.readOnly &&
						o.id !== "pageIcon" &&
						o.id !== "coverImage" &&
						o.id !== "pageCover"
				),
				hidden: options.filter(
					(o) =>
						!o.visible &&
						!o.readOnly &&
						o.id !== "pageIcon" &&
						o.id !== "coverImage" &&
						o.id !== "pageCover"
				),
			};
		} else {
			_flows.update($selectedFlow.id, "defaultDestination", {
				...$selectedFlow.defaultDestination,
				defaultSort: true,
			});
			return {
				visible: options
					.sort(
						(a, b) =>
							propData.defaultSort.indexOf(a.type) -
							propData.defaultSort.indexOf(b.type)
					)
					.filter(
						(o) =>
							o.visible &&
							!o.readOnly &&
							o.id !== "pageIcon" &&
							o.id !== "coverImage"
					),
				hidden: [],
			};
		}
	}
	async function requestedFuncs() {
		for (let v of values.visible) {
			if (v.requestFunction) {
				let func = v.requestFunction;
				console.log(func);
				let funcy = await import(
					`../../scripts/output-providers/${$selectedFlow.defaultDestination.provider}/get.ts`
				);
				const results = await funcy[func.func](...func.args);
				values.visible = values.visible.map((o) => {
					if (o.id === v.id) {
						return {
							...o,
							options: results,
						};
					} else {
						return o;
					}
				});
				console.log("Requested Func:", await results);
			}
		}
	}
	requestedFuncs();
	function handleDndConsider(e) {
		values = {
			...values,
			visible: e.detail.items,
		};
	}
	function handleDndFinalize(e) {
		values = {
			...values,
			visible: e.detail.items,
		};
		_flows.update($selectedFlow.id, "defaultDestination", {
			...$selectedFlow.defaultDestination,
			props: [...values.visible, ...values.hidden],
		});
	}

	function handleVisChange(e) {
		console.log(e);
		if (e.visible) {
			values = {
				visible: [...values.visible, e],
				hidden: values.hidden.filter((h) => h.id !== e.id),
			};
		} else {
			values = {
				visible: values.visible.filter((v) => v.id !== e.id),
				hidden: [...values.hidden, e],
			};
		}
	}
</script>

{#if options}
	<div
		class="main props-main"
		style={"max-height: " + ($maxSize.height - 204) + "px;"}
	>
		<div
			class="show-more-content"
			use:dndzone={{
				items: values.visible,
				flipDurationMs: 200,
				type: "visibleProps",
			}}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}
		>
			{#each values.visible as prop, i (prop.id)}
				<div
					class="prop"
					animate:flip={{ duration: 200 }}
				>
					{#if prop.requestFunction}
							<Prop
								bind:prop
								inputData={null}
								on:vischange={(e) => handleVisChange(e.detail)}
							/>
					{:else}
						<Prop
							bind:prop
							inputData={null}
							on:vischange={(e) => handleVisChange(e.detail)}
						/>
					{/if}
				</div>
			{/each}
		</div>
		{#if values.hidden.length > 0}
			<div class="show-more">
				<div
					class="show-more-button"
					on:click={() => (showMore = !showMore)}
				>
					{showMore ? "Hide" : "Show Hidden"}
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
			</div>
		{/if}
		<div class="show-more-content">
			{#if showMore}
				{#each values.hidden as prop, i (prop.id)}
					<div
						class="prop"
						style={!values.hidden || values.hidden.length > 0
							? "margin-bottom: 2px;"
							: ""}
						animate:flip={{ duration: 200 }}
					>
						<Prop
							bind:prop
							inputData={null}
							on:vischange={(e) => handleVisChange(e.detail)}
						/>
					</div>
				{/each}
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	@use "src/style/global" as *;

	.main {
		@include flex(column, flex-start, flex-start);
		@include scrollbar();
		overflow-y: overlay;
		overflow-x: visible;
		flex-grow: 1;
		background-color: var(--bg);
		width: 100%;
		border-top: $border-light;
		padding: $p16 0;
		box-sizing: border-box;
		height: 100%;
	}

	.prop {
		width: 100%;
		padding: 0 $p12;
		box-sizing: border-box;
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
	}
	.show-more-content {
		@include flex(column, flex-start, flex-start);
		overflow: visible;
		transition: height 0.2s ease-in-out;
		row-gap: $p12;
		width: 100%;
		box-sizing: border-box;
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
