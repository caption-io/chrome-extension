<script lang="ts">
	import Icons from './ui/Icons.svelte'
	import {valuesIn} from 'lodash-es'

    export let options: any;
	
	let items = Object.values(options);
	console.log(items);
</script>

<div class="main">
	{#if options !== null}
	{#each valuesIn(options) as option (option.id)}
		<div class="prop-container">
			<div class="prop-label">
				<Icons name={option.type} link={false} size="med" position="left" color="grey" light={true} />
				<h3>{option.name}</h3>
			</div>
			<div class="prop-input">
				<div>Input Device Here</div>
			</div>
		</div>
	{/each}
	{/if}

</div>

<style lang="scss">
    @use '../style/global' as *;

	.main {
		overflow: auto;
		flex-grow:1;
		@include scrollbar();
	}

	.prop-container {
		margin: 0.75rem 0 0 0.75rem;

	}

	.prop-label {
        @include flex('row', 'flex-start', 'center');
        margin-bottom: 0.25rem;
        > h3 {
            @include h3();
            flex-grow: 1;
        }
    }

	.prop-input {
		@include flex('row', 'flex-start', 'center');
		> div {
			flex-grow: 1;
		}
	}
</style>
