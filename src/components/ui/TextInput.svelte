<script lang="ts">
    import Icon from './Icon.svelte';

    export let placeholder: string = 'placeholder not set';
	export let type: string;
    export let inputIcon: Icons | null = null;
    export let labelText: string = null;
    export let labelIcon: Icons = null;
    export let value: string;

    let focused: boolean = false;
</script>

<div class="main">
    {#if labelText}
        <div class="input-label">
            {#if labelIcon}
                <Icon name={labelIcon} size="med" position="left" color="grey" light={true} link={false} />
            {/if}
            <div class="label-text">
				<h3>{labelText}</h3>
			</div>
        </div>
    {/if}
    <div class={`input-container ${focused ? ' focused' : ''}`}>
        {#if inputIcon}
            <Icon
                name={inputIcon}
                color={'grey'}
                position="left"
            />
        {/if}
        <input
            class="text-input"
            type="text"
            bind:value
			wrap="soft"
            {placeholder}
            on:focus={() => (focused = true)}
            on:blur={() => (focused = false)}
        />
    </div>
</div>

<style lang="scss">
    @use '../../style/global' as *;

    .main {
		@include flex(column, flex-start, flex-start);
		@include inputLabel();
		width: 100%;
        .input-container {
            @include flex(row, flex-start, center);
            min-height: 2.25rem;
            border: 1px solid var(--border-color);
			box-shadow: 0 0 0 0px var(--blue-200);
            border-radius: 4px;
            box-sizing: border-box;
			padding: 0 0.5rem;
			background: var(--white);
			transition: 200ms;
			width: 100%;
			&.focused {
				box-shadow: 0 0 0 3px var(--blue-light);
				border: 1px solid var(--blue);
			}
            .text-input {
                width: 100%;
                outline: none;
                border: none;
                background: transparent;
                font-family: var(--font-family);
                font-weight: 400;
				font-size: 0.875rem;
				min-height: 36px;
                &.colored {
                    color: var(--blue-dark);
                }
                &::placeholder {
                    color: var(--blue-800);
                    opacity: 0.75;
                }
            }
        }
    }
</style>
