<script>
    import { derived } from "svelte/store";
    import {getContext, onMount} from 'svelte';
    import {select} from 'd3';
    import {writable} from 'svelte/store';
    let circle;    
    
    export let duration = 300;
    export let transition = true;
    export let radius = 5;
    export let axis = true;
    export let center = {x: undefined, y: undefined} ;

    let xScale = getContext('xScale')
    let yScale = getContext('yScale')
    let rawAxis = writable(axis)
    let rawCenter =  writable({x:center.x || 0, y: center.y || 0})


    let _center = derived([xScale,yScale, rawCenter, rawAxis] , ([$xScale,$yScale, $rawCenter, $rawAxis])=>
                                            {
                                                if($rawAxis){
                                                    
                                                    return {x: $xScale($rawCenter.x || 0),  y: $yScale($rawCenter.y || 0)}}
                                                else {
                                                    
                                                    return {x: $xScale.invert($rawCenter.y || 0),  y: $yScale.invert($rawCenter.x || 0)}
                                                }
                                            })
 
    $:{rawCenter.update(($rawCenter)=>{return {...$rawCenter, ...center}});
        if(circle != null && transition )
            {select(circle).transition().duration(duration).attr("cx", $_center.x).attr("cy", $_center.y).attr("r", radius)}
          else 
            {select(circle).attr("cx", $_center.x).attr("cy", $_center.y).attr("r", radius)};
    }



    onMount(()=>{
        select(circle).attr("cx", $_center.x).attr("cy", $_center.y).attr("r", radius).attr("fill", "currentColor")
    })

</script>


<circle bind:this={circle}  />