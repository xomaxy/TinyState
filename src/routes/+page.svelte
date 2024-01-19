<script>
    import Graph from "./Graph.svelte";

    let center = {x: undefined, y: undefined}

</script>



<div class="flex flex-row gap-20 items-center">
    
        <div class="w-[500px]">
            <Graph bind:center={center}/>        
        </div>
    
    <div class="flex flex-col gap-5">
        <span>
            Coordinate Input
        </span>
        <input type="text" name="" id="" placeholder="x-coordinate" class="input p-2 boder-1" value={center.x || ""}/>
        <input type="text" name="" id="" placeholder="y-coordinate" class="input p-2" value={center.y || ""}/>
    </div>
    <div class="flex flex-col gap-5">
        <span>
            Temperature: 
        </span>
        <span>
            Pressure:
        </span>
    </div>

</div>

