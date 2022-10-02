<script lang="ts">
	import SveltyPicker from "svelty-picker";
	import Icon from "../ui/Icon.svelte";
	import {fade} from 'svelte/transition';

	export let type: "date" | "datetime" | "time" = "date";
	export let includeEnd: boolean = false;
	export let labelText: string = null;
	export let labelIcon: Icons = null;

	let includeEndLocal: boolean = false;
</script>

<div class="main" in:fade={{duration: 400, delay: 200}}>
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
			<div class="label-text">
				<h3>{labelText}</h3>
			</div>
		</div>
	{/if}
	<div class="picker">
		{#if type === "date" || type === "datetime"}
			<div class="date-picker">
				<Icon
					name="date"
					size="med"
					color="grey"
					light={true}
					link={false}
					position="left"
				/>
				<SveltyPicker
					mode="auto"
					inputClasses="form-control"
					format="yyyy-mm-dd"
					placeholder="Start date"
				/>
			</div>
		{/if}
		{#if type === "time" || type === "datetime"}
			<div class="time-picker">
				<Icon
					name="created_time"
					size="med"
					color="grey"
					light={true}
					link={false}
					position="left"
				/>
				<SveltyPicker mode="auto" inputClasses="form-control" format="H:i P" placeholder="Start time"/>
			</div>
		{/if}
	</div>
	{#if includeEnd}
		<div class="picker end">
			{#if type === "date" || type === "datetime"}
				<div class="date-picker">
					<Icon
						name="date"
						size="med"
						color="grey"
						light={true}
						link={false}
						position="left"
					/>
					<SveltyPicker
						mode="auto"
						inputClasses="form-control"
						format="yyyy-mm-dd"
						placeholder="End date"
					/>
				</div>
			{/if}
			{#if type === "time" || type === "datetime"}
				<div class="time-picker">
					<Icon
						name="created_time"
						size="med"
						color="grey"
						light={true}
						link={false}
						position="left"
					/>
					<SveltyPicker
						mode="auto"
						inputClasses="form-control"
						format="hh:i P"
						placeholder="End time"
					/>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	@use "../../style/global" as *;

	.main {
		@include flex(column, flex-start, flex-start);
		@include inputLabel();
		width: 100%;

		.picker {
			@include flex(row, flex-start, center);
			column-gap: 0.5rem;
			&.end {
				margin-top: 0.5rem;
			}
			.row-label {
				width: 2rem;
				h3 {
					@include h3();
				}
			}
		}
		.date-picker,
		.time-picker {
			box-sizing: border-box;
			border: 1px solid var(--border-color);
			border-radius: 0.25rem;
			@include flex(row, flex-start, center);
			min-height: 2.5rem;
			padding: 0 0.5rem;
			@include input-shadow();

			}
	}
</style>
