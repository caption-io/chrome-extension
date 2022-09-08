<script lang="ts">
	let incrementer = 0

	browser.storage.local.get('test').then(result => {
		if (result.test) {
			incrementer = result.test
		}
	})

	browser.storage.onChanged.addListener((changes, namespace) => {
		console.log(`This changed:`)
		console.log(namespace)
		console.log(changes)
	})

	function addValue() {
		browser.storage.local.set({ test: ++incrementer })
	}
</script>

<div class="main">
	<input bind:value={incrementer} type="button" on:click={() => addValue()} />
</div>

<style lang="scss">
	.main {
		min-height: 600;
		min-width: 800;
		padding: 1rem;
	}
</style>
