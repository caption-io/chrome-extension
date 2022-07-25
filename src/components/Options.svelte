<script lang="ts">
    import DatabaseSelect from "./DatabaseSelect.svelte";
    import Header from "./Header.svelte";
</script>

<div class="container">
    
    <Header />
    <div class="header">
        New Form
    </div>
    <DatabaseSelect />
</div>

<style lang="less">
    .container {
        min-width: 450px;
        min-height: 500px;
        display: flex;
        flex-direction: column;
        row-gap: 12px;
        margin: 0px 12px 0px 12px;
    }

    .header {
        font-size: 16px;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
        color: rgb(155, 155, 155);
    }

</style>