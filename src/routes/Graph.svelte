<script>
    
    import { onMount } from 'svelte';
    import {csv, pointer, select} from "d3";
    import D3, {svg, xScale, yScale} from "$D3/D3.svelte"
    import Axis from "$D3/Axis.svelte"
    import Path from "$D3/Path.svelte"
    import Circle from "$D3/Circle.svelte"

    let data = [];
    let axis = [];

    export {axis as axis}
    export {data as data}
    export let center = {x:undefined, y:undefined}



    onMount(() => {
        select(svg).on("click",(e)=>{  
            center = {x: $xScale.invert(pointer(e)[0]).toFixed(3), y:  $yScale.invert(pointer(e)[1]).toFixed(3)}
            console.log(JSON.stringify(center))
        })
    })

</script>


<D3 className="">

    {#if axis.length > 0}
        {#each axis as a}
        <Axis type="{a.type}" domain={{[`${a.type}`]: a.domain || [0,1]}} />
        {/each}
    {/if}
    
    <Path data={data}/>
    <Circle {center}/>
</D3>





