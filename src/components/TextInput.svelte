<script lang="ts">
	import Icons from './Icons.svelte';
	import Svelecte, { addFormatter } from 'svelecte';
	import { webData } from '../scripts/stores';
    import { iconOnlyRenderer, webDataRenderer } from '../scripts/svelecte-renderers';

	export let propType;
    export let props;
    
    console.log(props);

    let webDataValue = "none";
    let webDataInput;
    let selected;

    function setInputValue(selected, value) {
        console.log(selected, value);
        if (!selected || selected.text === 'None') {
            webDataInput = "";
            console.log("none");
        } else {
            webDataInput = selected.value;
            console.log(selected.value);
        }
    }

    $: setInputValue(selected, webDataValue);

	let typeValue = 'web';

	$: console.log(Object.values($webData.textValues));

	
	addFormatter('icononly', iconOnlyRenderer);
    addFormatter('webdata', webDataRenderer);

</script>

<div style="width: 100%; margin-bottom: 8px;">
	<div class="input-label">
		<Icons name={props.type} link={false} />
		<h3>{props.name}</h3>
		<div class="options-handle">
			<Icons name="more" link={true} />
		</div>
	</div>
	<div class="prop-input-text">
			<div class="prop-input-text-select">
				<Svelecte options={Object.values($webData.textValues)} renderer="webdata" placeholder="Web data..." bind:value={webDataValue} bind:readSelection={selected}/>
			</div>
            <input class="text-input" type="text" bind:value={webDataInput} />
	</div>
</div>
