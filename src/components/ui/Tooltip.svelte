<script lang="ts">
	import {tooltip} from '../../scripts/stores'
	import { fade } from 'svelte/transition';
    // tooltip component with carrot that floats to the side of the mouse
    // and displays a message
    export let showTooltip: boolean = $tooltip.show;
    export let message: string = $tooltip.text;
	export let position = {x: 0, y: 0, wx: '', wy: ''};
	let showAfterDelay = false;

	$: ((show) => {
		if (show) {
			setTimeout(() => {
				showAfterDelay = show;
			}, 500);
		} else {
			showAfterDelay = show;
		}
	})(showTooltip);

	let ap: string;

	function posAdj(position) {
		console.log(position);
		if (position.wx === "left" && position.wy === "top") {
			ap = `
				left: ${position.x}px,
				top: ${position.y}px,
			`;
		} else if (position.wx === "left" && position.wy === "bottom") {
			ap = `
				left: ${position.x}px,
				bottom: ${position.y}px,
			`;
		} else if (position.wx === "right" && position.wy === "top") {
			ap = `
				right: ${position.x * -1}px,
				top: ${position.y}px,
			`;
		} else if (position.wx === "right" && position.wy === "bottom") {
			ap = `
				right: ${position.x}px,
				bottom: ${position.y}px,
			`;
		}
	}

	$: posAdj(position);


</script>

<div class="tooltip-layer" >
    {#if showAfterDelay}
        <div 
			class="tooltip"
			style={ap}
			transition:fade={{duration: 300}}
		>
            <div class="tooltip-message">
                {message}
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    @use '../../style/global' as *;

    .tooltip-layer {
        position: absolute;
        top: 0;
        left: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
    }

    .tooltip {
        @include flex('row', 'center', 'center');
        position: absolute;
        background-color: var(--bg);
		border: 1px solid var(--border-color);
        border-radius: 0.3rem;
		padding: .25rem .25rem;
		max-width: 96px;
        z-index: 999;
        transition: opacity 0.1s;
		box-shadow: 0 0 8px 0px rgba(0,0,0,-.07);
		.tooltip-message {
			@include flex('row', 'center', 'center');
			color: var(--text-dark);
			font-size: 0.75rem;
			font-weight: 600;
			white-space: wrap;
		}
    }

    .tooltip-message {
        @include ui-text-default();
    }

    .tooltip.show {
        opacity: 1;
        z-index: 100;
    }
</style>
