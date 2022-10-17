<script lang="ts">
	import Icon from "src/components/ui/Icon.svelte";

const tabs: {name: string, icon: Icons}[] = [
	{
		name: "Flows",
		icon: "flowPlus",
	},
	{
		name: "Scripts",
		icon: "code",
	},
	{
		name: "Settings",
		icon: "sliders",
	},
];

</script>

<div class="tab-bar">
	{#each tabs as tab}
		<div class="tab">
			<Icon name={tab.icon} color="grey" size={20} />
			<div class="tab-label">{tab.name}</div>
		</div>
	{/each}
</div>

<style lang="scss">
	@use "src/style/global" as *;

	.tab-bar {
		@include flex(row, space-between, center);
		width: 100%;
		padding: 1rem;
		background-color: var(--gray-100);
		box-sizing: border-box;
		.tab {
			@include flex(column, center, center);
			height: 100%;
			width: 100%;
			.tab-label {
				@include ui-text(var(--gray-600), 0.875rem, 500);
			}
		}
	}
</style>

