<script>
    import {select, axisLeft, axisBottom} from 'd3';
    import {onMount, getContext} from 'svelte';
    let axis;
    
    let xScale = getContext('xScale')
    let yScale = getContext('yScale')
    let _domain = getContext('domain')

    export let type ='x'
    export let duration = 500;
    export let transition = true;
    export let domain = {};

    $: _domain.update(($_domain)=>{return {...$_domain, ...domain}})
    
    $: if((type === 'x') && transition ){ select(axis).transition().duration(duration).call(axisBottom($xScale))} else if (type === 'x') {select(axis).call(axisBottom($xScale))}

    $: if((type === 'y') && transition ){ select(axis).transition().duration(duration).call(axisLeft($yScale))} else if (type === 'y') {select(axis).call(axisLeft($yScale)); console.log("y has changed")}
   
//    $: if((type === 'y') && transition ){ select(axis).transition().duration(duration).attr("transform", `translate(${$xScale(Math.min(...$domain.x))},0)`).call(axisLeft($yScale))} else if (type === 'y') {select(axis).call(axisLeft($yScale)); console.log("y has changed")}
//    $: if((type === 'x') && transition ){ select(axis).transition().duration(duration).attr("transform", `translate(0,${$yScale(Math.min(...$domain.y))})`).call(axisBottom($xScale))} else if (type === 'x') {select(axis).call(axisBottom($xScale))}
    onMount(()=>{
        if(type === 'x') select(axis).attr("transform", `translate(0,${$yScale(Math.min(...$_domain.y))})`).call(axisBottom($xScale))
        if(type === 'y') select(axis).attr("transform", `translate(${$xScale(Math.min(...$_domain.x))},0)`).call(axisLeft($yScale))
    })
    
</script>


<g bind:this={axis}/>
