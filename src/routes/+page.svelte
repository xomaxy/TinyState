<script>
    import Graph from "./Graph.svelte";
    import {csv, scaleLinear} from "d3"
    let center = {x: 0, y: 0}
    let rangeT, rangeP;
    let rawdata;
    let values = [];

    let min = n => Math.round(n*100)/100

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
                let bp = rawdata.find(d => d.T >= center.x )
                let bbp = rawdata[rawdata.indexOf(bp)-1]

                let scales = Object.keys(bp).map( key=>{console.log(key,bbp[key],bp[key]);return scaleLinear([bbp[key],bp[key]])} )

                let normVale = scales[0].invert(center.x)
                
                values = scales.map((scale) => scale(normVale))

                


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
        <input type="text" name="" id="" placeholder="x-coordinate" class="input p-2 boder-1" bind:value={center.x }/>
        <input type="text" name="" id="" placeholder="y-coordinate" class="input p-2" bind:value={center.y }/>

        <table class="table table-hover border-separate border-spacing-2">
            <thead>
                
                <tr>
                    <th>T (K)</th>
                    <th>P (KPa)</th>
                    <th>H1</th>
                    <th>H2</th>
                    <th>U1</th>
                    <th>U2</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>
                        {min(values[0]) || 0}
                    </th>
                    <th>
                        {min(values[1]) || 0}
                    </th>
                    <th>
                        {min(values[2]) || 0}
                    </th>
                    <th>
                        {min(values[3]) || 0}
                    </th>
                    <th>
                        {min(values[4]) || 0}
                    </th>
                    <th>
                        {min(values[5])|| 0}
                    </th>
                </tr>
            </tbody>
        </table>

        <table class="table table-hover">
            <thead>
                <tr>
                    <th>Ve1</th>
                    <th>Ve2</th>
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
                        {min(values[6]*100)|| 0}
                    </th>
                    <th>
                        {min(values[7])|| 0}
                    </th>
                    <th>
                        {min(values[8])|| 0}
                    </th>
                    <th>
                        {min(values[9])|| 0}
                    </th>
                    <th>
                        {min(values[10])|| 0}
                    </th>
                    <th>
                        {min(values[12])|| 0}
                    </th>
                    <th>
                        {min(values[13])|| 0}
                    </th>
                  
                </tr>
            </tbody>
        </table>
    </div>
    

</div>
