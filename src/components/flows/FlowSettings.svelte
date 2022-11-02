<script lang="ts">
	import { fly } from "svelte/transition";
	import Svelecte from "svelecte";
	import { selectedFlow } from "src/scripts/platform/stores";
	import { _flows } from "src/scripts/platform/flows-scripts";
	let tags = $selectedFlow.tags;
</script>

<div
	id="flow-settings"
	class="main"
	in:fly={{ duration: 200, x: 400, delay: 200 }}
	out:fly={{ duration: 200, x: 400 }}
>
	<Svelecte
		options={tags}
		multiple={true}
		creatable={true}
		keepCreated={true}
		creatablePrefix={""}
	/>
</div>

<style lang="scss">
	@use "src/style/global" as *;
	.main {
		height: 200px;
		width: 100%;
		padding: $p12;
		box-sizing: border-box;
	}
</style>
