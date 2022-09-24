<script context="module" lang="ts">

	export type Type = "dbPicker" | "webPicker" | "select" | "multi_select" | "relation" | "people"

</script>

<script lang="ts">
	import Icons from './Icons.svelte'
	import Svelecte, { addFormatter } from 'svelecte'
	import { webData } from '../../scripts/stores'

	export let options: [];
	export let type: SelectComponentType;
</script>