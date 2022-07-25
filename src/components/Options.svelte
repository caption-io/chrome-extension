<script lang="ts">
    import DatabaseSelect from "./DatabaseSelect.svelte";
    import Header from "./Header.svelte";
</script>

<div class="container">
    <Header />
    <DatabaseSelect />
</div>

<style lang="less">
    .container {
        min-width: 450px;
        min-height: 500px;
        display: flex;
        flex-direction: column;
        row-gap: 8px;
        margin: 0px 8px 0px 8px;
    }

</style>