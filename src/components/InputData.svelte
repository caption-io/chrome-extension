<script lang="ts">
	import { inputManifest } from "src/providers-manifest";
  import Icon from "./ui/Icon.svelte";
	let fakeManifest: {name: string, id: string, icon: Icons }[] = [
		{ name: "Web Data", id: "webdata", icon: "web" },
		{ name: "Date & Time", id: "dateTime", icon: "date" },
	];
	let activeTab = fakeManifest[0].id;


</script>

<div class="input-data-container">
	<div class="tab-container">
		{#each fakeManifest as tab}
			<div class="tab" class:active={activeTab === tab.id} on:click={() => activeTab = tab.id}>
				<div class="tab-icon">
					<Icon icon={tab.icon} color="blue" size={12} />
				</div>
				<div class="tab-text">{tab.name}</div>
			</div>
		{/each}
	</div>
	<div class="input-data-selector">
		Stuff
	</div>
</div>

<style lang="scss">
	@use "src/style/global" as *;

	.input-data-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		border-radius: $p8;
		border: 1px solid var(--blue);
		background-color: var(--blue-light);
		box-sizing: border-box;
		.tab-container {
			display: flex;
			flex-direction: row;
			column-gap: $p6;
			padding: $p6;
			box-sizing: border-box;
			.tab {
				display: flex;
				flex-direction: row;
				align-items: center;
				padding: $p6 $p12;
				transition: $transition;
				cursor: pointer;
				background-color: var(--blue-light);
				border-radius: var(--border-radius);
				.tab-icon {
					margin-right: $p3;
				}
				.tab-text {
					@include ui-text(var(--blue), $p12, 500);
				}
				&.active {
					background-color: var(--bg);
					box-shadow: 0 2px 4px 0 var(--shadow-color);
				}
			}
		}
		.input-data-selector {
			display: flex;
			flex-direction: column;
			padding: $p12;
			height: 200px;
			box-sizing: border-box;
		}
	}
</style>