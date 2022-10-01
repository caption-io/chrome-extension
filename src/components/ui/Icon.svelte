<script lang="ts">
	import {icons} from '../../icons';
    // exported props
    export let name: Icons = null;
    export let url: string = null;
    export let size: 'small' | 'med' | 'big' = 'med';
    export let color: AppColors = 'grey';
    export let position: 'left' | 'right' | 'center' = 'center';
    export let disabled: boolean = false;
    export let link: boolean = false;
    export let topMargin: boolean = null;
	export let light: boolean = false;

    // css class definitions
    const cssClass = `icon
    ${' ' + size}
    ${' ' + position}
    ${' ' + disabled}
	${light ? ' light' : ''}
    ${link ? ' link' : ''}`;
</script>

<div class={`${cssClass} ${color}`} on:click on:mouseenter on:mouseleave>
    {#if name && !url}
        {@html icons[name]}
    {/if}
    {#if url}
        <img class="url-icon" src={url} alt="" />
    {/if}
</div>

<style lang="scss">
    @use '../../style/global' as *;

    @mixin colors($color) {
        &.#{$color} {
            fill: var(--#{$color});
			color: var(--#{$color});
            &.link {
                border-radius: 4px;
                padding: 4px;
                cursor: pointer;
                margin: 0px;
                transition: 200ms ease-in-out;
                &:hover {
                    background-color: var(--#{$color}-light);
                }
            }
        }
    }

    .icon {
        @include flex(row, center, center);
        @each $appcolor in $app-colors {
            @include colors($appcolor);
        }
        &.small {
            width: 14px;
            height: 14px;
        }
        &.med {
            width: 16px;
            height: 16px;
        }
        &.big {
            width: 16px;
            height: 16px;
        }

        &.left {
            margin: 0px 4px 0 0;
        }
        &.right {
            margin: 1px 0 0 4px;
        }
        &.center {
            margin: 0 0 0 0;
        }
		&.light {
			opacity: 0.7;
		}
        &:not(.link) {
            pointer-events: none;
        }
        .url-icon {
            width: 100%;
            height: 100%;
        }
    }
</style>
