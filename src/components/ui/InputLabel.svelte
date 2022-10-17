<script lang="ts">
	import Icon from "./Icon.svelte";

	export let text: string;
	export let icon: Icons;
</script>

<div class="main">
	<div class="input-label">
		{#if icon}
			<Icon
				name={icon}
				size={16}
				color="gray-500"
			/>
		{/if}
		<p class="text">{text}</p>
	</div>
</div>

<style lang="scss">
	@use "../../style/global" as *;
	.input-label {
		@include flex(row, flex-start, center);
		margin: 0 0 $p6 $p3;
			.text {
				@include ui-text(var(--text-secondary), $p14, 400);
				display: block;
				flex-grow: 1;
				margin: 0 0 0 $p3;
			}
	}
</style>
