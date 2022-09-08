<script lang="ts">

	// VARS: Props
	export let noMargin: boolean = false;

</script>

<div class={`hor-rule${noMargin ? " no-margin" : ""}`} />

<style lang="scss">
	@use '../../style/global' as g;
	.hor-rule {
		width: 100%;
		height: 1px;
		background-color: var(--divider-color);
		&.no-margin {
			margin: 0 -1rem;
			width: calc( 100% + 2rem );
		}
	}

</style>
