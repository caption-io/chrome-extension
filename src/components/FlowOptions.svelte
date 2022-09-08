<script lang="ts">
    // IMPT: Packages
    import { fly, fade } from 'svelte/transition';

    // IMPT: Components
    import Icons from './ui/Icons.svelte';

    // VARS: Local
    let hoverColor: 'danger' | 'inverted' = 'danger';

    // FUNC: Handlers
    function dangerHover(hovered: boolean) {
        hovered ? (hoverColor = 'inverted') : (hoverColor = 'danger');
        console.log(hoverColor);
    }
	// TODO: handle flow deletion
</script>

<div class="main" in:fade={{ duration: 200 }} out:fade={{ duration: 200 }}>
    <div
        class="menu-option delete"
        on:mouseleave={() => dangerHover(false)}
        on:mouseenter={() => dangerHover(true)}
    >
        <Icons name="trash" size="med" color={hoverColor} position="right" />
        <div class="menu-option-text delete">Delete</div>
    </div>
</div>

<style lang="scss">
    @use '../style/global' as *;
    .main {
        border: 1px solid var(--border-color);
        padding: 0.25rem 0.25rem;
        border-radius: 4px;
        box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 0.07);
        background: var(--bg);
        .menu-option {
            @include flex();
            width: calc(200px - 1rem);
            border-radius: 4px;
            cursor: pointer;
            &.delete {
                > .menu-option-text {
                    color: var(--ui-red);
                }
                &:hover {
                    background: var(--ui-red);
                    color: #fafafa;
                    > .menu-option-text {
                        color: #fafafa;
                    }
                }
            }
        }
        .menu-option-text {
            @include ui-text-default();
            padding: 0.25rem 0.5rem;
        }
    }
</style>
