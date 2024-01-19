<script>
    import { line, curveNatural } from 'd3';
    import { onMount, getContext } from 'svelte';
    import {select} from 'd3';
    import { derived, writable } from 'svelte/store';
    let path;
    export let data;
    let curve = line().curve(curveNatural)
    let xScale = getContext('xScale')
    let yScale = getContext('yScale')
    let rawData = (data != null) ? writable(data) : writable([[0,0],[0.5,0.5],[1,1]])


    const _data = derived([xScale,yScale,rawData], ([$xScale,$yScale, $rawData])=>{
        if($rawData != null){
            return $rawData.map((d)=>{return [$xScale(d[0]), $yScale(d[1])]})
        }
        else return null
    })
    
    $: rawData.update(($rawData)=>{return data})
    $: if (path != null ) {select(path).attr("d", curve($_data)).attr('stroke', 'currentColor')
                    .attr('fill', 'none')
                    .attr("stroke-width", 3);}

    onMount(()=>{
    
      if (path != null ) {select(path).attr("d", curve($_data)).attr('stroke', 'black')
                    .attr('fill', 'none')
                    .attr("stroke-width", 3);}
        
    })
    
</script>

<path bind:this={path} />