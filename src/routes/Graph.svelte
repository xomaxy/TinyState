<script>
    function zip() {
    let args = [].slice.call(arguments);
    let shortest = args.length==0 ? [] : args.reduce(function(a,b){
        return a.length<b.length ? a : b
    });

    return shortest.map(function(_,i){
        return args.map(function(array){return array[i]})
    });
    }
    import { onMount } from 'svelte';
    import {csv, pointer, select} from "d3";
    import D3, {svg, xScale, yScale} from "$D3/D3.svelte"
    import Axis from "$D3/Axis.svelte"
    import Path from "$D3/Path.svelte"
    import Circle from "$D3/Circle.svelte"

    csv("data/A4.csv").then((data)=>{
        let keys = Object.keys(data[0])
        let ranges = keys.map((key) => {
            
            return {key, 
                    min: Math.min(...data.map((d)=>d[key])),
                    max: Math.max(...data.map((d)=>d[key]))
                }
            
        })

        console.log(ranges)
    
        axis = axis.map( a =>{
            let range = ranges.find(r => r.key === a.id)
            return {...a, domain:[range.min, range.max]}
            
        })

        rawData = zip(...axis.map(a=>data.map(d=>d[a.id])))
        
    })

    
    let axis = [{type: "x", label:"Temperatura", id:"T" , domain:undefined},
                {type: "y", label:"Presión", id:"P", domain:undefined}];

    let rawData = [];

    export let center = {x:undefined, y:undefined}

    onMount(() => {
        select(svg).on("click",(e)=>{  
            center = {x: $xScale.invert(pointer(e)[0]), y:  $yScale.invert(pointer(e)[1])}
            console.log(JSON.stringify(center))
        })
    })

</script>


<D3 className="">
    {#each axis as a}
        <Axis type="{a.type}" domain={{[`${a.type}`]: a.domain || [0,1]}} />
    {/each}
    <Path data={rawData}/>
    <Circle {center}/>
</D3>





