<script>
    import Graph from "./Graph.svelte";
    import {csv} from "d3"
    let center = {x: undefined, y: undefined}
    let rangeT, rangeP;
    let rawdata;

    csv("data/A4.csv").then((data)=>{
        let keys = Object.keys(data[0])
        let ranges = keys.map((key) => {
            
            return {key, 
                    min: Math.min(...data.map((d)=>d[key])),
                    max: Math.max(...data.map((d)=>d[key]))
                }
            
        })

        rangeT = ranges[0]
        rangeP = ranges[1]

        rawdata = data
    })


    $: {
        if(center.x != undefined && center.y != undefined && rawdata!= undefined){
            if (center.x >= rangeT.min && center.x <= rangeT.max && center.y >= rangeP.min && center.y <= rangeP.max){
                console.log("Center is in long range")
            }
        }
    }

</script>



<div class="flex flex-row gap-10 items-center flex-nowrap ">
    
        <div class="  w-[700px] ">
            <Graph bind:center={center}/>        
        </div>
    
    <div class="flex flex-col gap-5">
        <span>
            Coordinate Input
        </span>
        <input type="text" name="" id="" placeholder="x-coordinate" class="input p-2 boder-1" value={center.x || ""}/>
        <input type="text" name="" id="" placeholder="y-coordinate" class="input p-2" value={center.y || ""}/>

        <table class="table table-hover border-separate border-spacing-2">
            <thead>
                <tr>
                    <th>T (K)</th>
                    <th>P (KPa)</th>
                    <th>S1</th>
                    <th>S2</th>
                    <th>EH</th>
                    <th>EU</th>
                    <th>ES</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>
                        {Math.round(center.x*100)/100 || 0}
                    </th>
                    <th>
                        {Math.round(100*Math.round(center.y*100)/100000)/100 || 0}
                    </th>
                    <th>
                        0.0
                    </th>
                    <th>
                        0.0
                    </th>
                </tr>
            </tbody>
        </table>

        <table class="table table-hover">
            <thead>
                <tr>
                    <th>H1</th>
                    <th>H2</th>
                    <th>U1</th>
                    <th>U2</th>
                    <th>Ve1</th>
                    <th>Ve2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>
                        0.0
                    </th>
                    <th>
                        0.0
                    </th>
                    <th>
                        0.0
                    </th>
                    <th>
                        0.0
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
    

</div>
