<!-- <script lang="ts">
	import SveltyPicker from "svelty-picker";
	import Icon from "./Icon.svelte";

	export let type: "date" | "datetime" | "time" = "date";
	export let includeEnd: boolean = false;

	let includeEndLocal: boolean = false;
</script>

<div class={`main${includeEndLocal ? ' has-end' : ''}`}>
	<div class="picker">
		{#if type === "date" || type === "datetime"}
			<div class="start-picker">
				<div class="dpicker">
					<Icon
						name="date"
						size={16}
						color="gray-500"
						position="l"
					/>
					<SveltyPicker
						mode="auto"
						inputClasses="form-control"
						format="yyyy-mm-dd"
						placeholder={`${includeEndLocal ? "Start date" : "Date"}`}
					/>
				</div>
				<div class="divider" />
				<div class="tpicker">
					<Icon
						name="created_time"
						size={16}
						color="gray-500"
						position="l"
					/>
					<SveltyPicker
						mode="auto"
						inputClasses="form-control"
						format="H:i P"
						placeholder={`${includeEndLocal ? "Start time" : "Time"}`}
					/>
				</div>
			</div>
		{/if}
		{#if type === "time" || type === "datetime"}
			{#if includeEndLocal}
				<div class="end-picker">
					<div class="dpicker">
						<Icon
							name="date"
							size={16}
							color="gray-500"
							position="l"
						/>
						<SveltyPicker
							mode="auto"
							inputClasses="form-control"
							format="yyyy-mm-dd"
							placeholder={`${includeEndLocal ? "End date" : "Date"}`}
						/>
					</div>
					<div class="divider" />
					<div class="tpicker">
						<Icon
							name="created_time"
							size={16}
							color="gray-500"
							position="l"
						/>
						<SveltyPicker
							mode="auto"
							inputClasses="form-control"
							format="H:i P"
							placeholder={`${includeEndLocal ? "End time" : "Time"}`}
						/>
					</div>
				</div>
			{/if}
		{/if}
	</div>
	<div class="includer" on:click={() => (includeEndLocal = !includeEndLocal)}>
		<div class="text">{`${includeEndLocal ? "Hide end" : "Include End"}`}</div>
		<div class="icon">
			<Icon
				name="chevronRight"
				size="med"
				color="grey"
				light={true}
				link={false}
				position="left"
			/>
		</div>
	</div>
</div>

<style lang="scss">
	@use "../../style/global" as *;

	.main {
		@include flex(column, flex-start, flex-start);
		width: 100%;
		height: 80px;
		transition: 300ms ease;

		.picker {
			@include flex(column, flex-start, center);
			.row-label {
				width: 2rem;
				h3 {
					@include ui-text(var(--text), $p14, 500)
				}
			}
		}
		.end-picker,
		.start-picker {
			@include flex(row, flex-start, center);
			row-gap: 0.5rem;
			@include input-shadow();
			.divider {
				width: 1px;
				height: 1.75rem;
				background-color: var(--border-color-light);
			}
			.dpicker,
			.tpicker {
				box-sizing: border-box;
				@include flex(row, flex-start, center);
				min-height: 2.5rem;
				padding: 0 0.5rem;
			}
			.dpicker {
				border-radius: 0.25rem 0 0 0.25rem;
				border-top: 1px solid var(--border-color);
				border-left: 1px solid var(--border-color);
				border-bottom: 1px solid var(--border-color);
			}
			.tpicker {
				border-radius: 0 0.25rem 0.25rem 0;
				border-top: 1px solid var(--border-color);
				border-right: 1px solid var(--border-color);
				border-bottom: 1px solid var(--border-color);
			}
		}
		.end-picker {
			height: 0px;
			opacity: 0;
			transition: 300ms ease;
			overflow: hidden;

		}
		.includer {
			margin-top: 0.5rem;
			@include flex(row, center, center);
			width: 100%;
			height: 2rem;
			background-color: var(--bg-darker);
			border-radius: var(--border-radius);
			.text {
				@include ui-text(var(--text-light), 0.875rem, 500);
			}
			.icon {
				transform: rotate(90deg);
				opacity: 0.8;
				transition: 300ms ease;
			}
		}
		&.has-end {
			height: 128px;
			.end-picker {
			margin-top: 0.5rem;

				height: 40px;
				opacity: 1;
			}
			.icon {
				transform: rotate(-90deg);
			}
		}
	}
</style> -->

<div>DATETIME</div>
