<script>
    import Graph from "./Graph.svelte";
    import {csv, interval, scaleLinear, dsv, text} from "d3"
    import { Slice } from "lucide-svelte";
    import { RangeSlider } from '@skeletonlabs/skeleton';
    import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';

    

    import numbro from "numbro"



    function zip() {
        let args = [].slice.call(arguments);
        let shortest = args.length==0 ? [] : args.reduce(function(a,b){
            return a.length<b.length ? a : b
        });

        return shortest.map(function(_,i){
            return args.map(function(array){return array[i]})
        });
    }

    function showNumber(n) {
        return numbro(n).format({thousandSeparated: true, mantissa: 3})
    }

    function isIn(number, range) {
  const [min, max] = range[0] < range[1] ? range : [range[1], range[0]];
  return number >= min && number <= max;
}

function distanceToLine(C, [A, B]) {
  // Check if A and B are the same point
  if (A[0] === B[0] && A[1] === B[1]) {
    // Calculate and return the Euclidean distance between C and A
    return 0;
  }

  // Destructuring the points for readability
  const [x1, y1] = A;
  const [x2, y2] = B;
  const [x0, y0] = C;

  // Calculate the distance from C to the line defined by A and B
  return Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
}


    // Variables for components
    let tabSet = 0 

    let selectQualityBy,thermoForQuality, midValue;

    let enforceOnePoint = false

    // Variables for engine

    let center = {x: 0, y: 0}
    
    let values = {x:[],y:[]};

    let axis = [{type: "x", label:"Temperatura", id:"T" , domain:undefined},
                {type: "y", label:"Presión", id:"P", domain:undefined}];

    let quality = 0.5

    let units = {
        T: "C",
        P: "KPa",
        H: "kJ/kg",
        U: "kJ/kg",
        S: "kJ/kgK",
        Ve: "m^3/kg (10^3)",
        EH: "kJ/kg",
        EU: "kJ/kg",
        ES: "kJ/kgK",
    }

    // Mutable data
    let axisX, axisY;
    let rawData;
    let keys;
    let plotedData;
    let isCloseToCurve;
    let isUp;
    let updateRanges;
    let updateData;

    // Data for final

    let dataA6, dataA7;

    /*csv("data/A4.csv").then((data)=>{
        let keys = Object.keys(data[0])
        let ranges = keys.map((key) => {
            
            return {key, 
                    min: Math.min(...data.map((d)=>d[key])),
                    max: Math.max(...data.map((d)=>d[key]))
                }
            
        })

        console.log("I am ranges",ranges)

        rangeT = ranges[0]
        rangeP = ranges[1]

        rawData = data
    })*/

    csv("data/A4.csv").then((data)=>{
        console.log("Fetching data, this is also the raw data",data)
        keys = Object.keys(data[0])
        console.log("The keys are",keys)
        let ranges = keys.map((key) => {
            
            return {key, 
                    min: Math.min(...data.map((d)=>d[key])),
                    max: Math.max(...data.map((d)=>d[key]))
                }
            
        })

        console.log("The object with ranges is",ranges)
    
        axis = axis.map( a =>{
            let range = ranges.find(r => r.key === a.id)
            return {...a, domain:[range.min, range.max]}
            
        })

        console.log("The axis are",axis)

        axisX = axis.find(a => a.type === "x")
        axisY = axis.find(a => a.type === "y")


        rawData = data

        plotedData = rawData.map((d) => {

            return [d[axisX.id], d[axisY.id]]

        })

        updateRanges = ()=>{
           axis = axis.map( a =>{
            let range = ranges.find(r => r.key === a.id)
            return {...a, domain:[range.min, range.max]}

            
        })
        console.log("Las axis han cambiando", axis)

        }
        
        updateData  = () =>{
            plotedData = rawData.map((d) => {
                axisX = axis.find(a => a.type === "x")
                axisY = axis.find(a => a.type === "y")

            return [d[axisX.id], d[axisY.id]]

            })
        console.log("Las data han cambiando", plotedData)

        }
    })

    
    dsv(";","data/A6.csv").then((data)=>{


        const reorganizedData = data.reduce((acc, item) => {
        Object.keys(item).forEach(key => {
            const [letter, value] = key.split('_');
            const valNum = parseFloat(value);
            if (!acc[valNum]) {
            acc[valNum] = {};
            }
            if (!acc[valNum][letter]) {
            acc[valNum][letter] = [];
            }
            acc[valNum][letter].push(item[key]);
        });
        return acc;
        }, {});

        dataA6 = reorganizedData

        
    })

    dsv(";","data/A7.csv").then((data)=>{


    const reorganizedData = data.reduce((acc, item) => {
    Object.keys(item).forEach(key => {
        const [letter, value] = key.split('_');
        const valNum = parseFloat(value);
        if (!acc[valNum]) {
        acc[valNum] = {};
        }
        if (!acc[valNum][letter]) {
        acc[valNum][letter] = [];
        }
        acc[valNum][letter].push(item[key]);
    });
    return acc;
    }, {});

    dataA7 = reorganizedData


    })




    $: {
        if(center.x != undefined && center.y != undefined && rawData!= undefined){

            let intervalPoint = {
                    X: 
                    [
                        rawData.find(point => Number(point[axisX.id]) >= center.x ) || rawData[0],
                        rawData[rawData.indexOf(
                            rawData.find(point => Number(point[axisX.id]) >= center.x )
                        )-1] || rawData[0]
                    ]
                    ,
                    Y:
                    [
                        rawData.find(point => Number(point[axisY.id]) >= center.y ) || rawData[0],
                        rawData
                        [
                            rawData.indexOf(
                                rawData.find(point => Number(point[axisY.id]) >= center.y )
                            )-1
                        ] || rawData[0]
                    ]
                }


                console.log("The interval point is",intervalPoint)    

                

                let scales = keys.map( key => {
                    return {
                        [`${key}`]: {
                            X: scaleLinear([intervalPoint.X[1][axisX.id],[intervalPoint.X[0][axisX.id]]],
                                            [intervalPoint.X[1][key],intervalPoint.X[0][key]]),

                            Y: scaleLinear([intervalPoint.Y[1][axisY.id],[intervalPoint.Y[0][axisY.id]]],
                                            [intervalPoint.Y[1][key],intervalPoint.Y[0][key]]),

                        } 
                }
            })

                console.log("The scales are",scales)



                let interValue = {
                    interpolatebyX : scales.map(
                        (scale) => {
                            return {
                                    variable: `${Object.keys(scale)[0]}`,
                                    guess: scale[`${Object.keys(scale)[0]}`].X(center.x)
                                }
                    }),
                    interpolatebyY : scales.map(
                        (scale) => {
                            return {
                                    variable: `${Object.keys(scale)[0]}`,
                                    guess: scale[`${Object.keys(scale)[0]}`].Y(center.y)
                                }
                            }
                    )
                }
                
                console.log("The interval value is",interValue)
                

                plotedData = rawData.map((d) => {

                    return [d[axisX.id], d[axisY.id]]
                    
                })

                if("values" === "values"){
                    values.x = interValue.interpolatebyX
                    values.y = interValue.interpolatebyY
                }

                let midpoints = [
                    [
                    (
                        Number(intervalPoint.X[0][axisX.id])+
                        Number(intervalPoint.X[1][axisX.id])
                    )/2,
                    (
                        Number(intervalPoint.X[0][axisY.id])+
                        Number(intervalPoint.X[1][axisY.id])
                    )/2
                    ],
                    [
                    (
                        Number(intervalPoint.Y[0][axisX.id])+
                        Number(intervalPoint.Y[1][axisX.id])
                    )/2,
                    (
                        Number(intervalPoint.Y[0][axisY.id])+
                        Number(intervalPoint.Y[1][axisY.id])
                    )/2
                    ]
                ]

                let distance = distanceToLine([center.x,center.y], midpoints )


                console.log("The domains are",axisX.domain, axisY.domain)

            if (isIn(center.x, axisX.domain) && isIn(center.y, axisY.domain)){

                if(axis[0].id != 'T' || axis[0].id != 'P'){
                    isCloseToCurve = true
                    console.log("Close for everyone that is not T and P")
                }else {
                    isCloseToCurve = distance < 10

                }

                console.log("Is close?",isCloseToCurve)

                isUp = center.y > midpoints[0][1]

                console.log("Is up?",isUp)




            }else {
                if(axis[0].id != 'T' || axis[0].id != 'P'){
                    isCloseToCurve = true
                    console.log("Close for everyone that is not T and P")
                }
            }
            /**
            if(!isCloseToCurve) {


                console.log("Is up?",isUp)

                console.log("This should trigger the the load of A6 and A7 data")

                console.log(dataA6 !== undefined && dataA7 !== undefined)

                if(dataA6 !== undefined && dataA7 !== undefined){
                console.log("dataA6 and dataA7 are defined")
                console.log("Load A6?",isUp)
                    if(isUp){
                        let datachoise = dataA6
                        console.log("This is table A6",datachoise)

                        function calculateTwice(){
                            let keys = Object.keys(datachoise)

                            let min = keys.find(k => numbro(k).value > center.x)
                            let max = keys[(keys.indexOf(min)+1)]

                            let interval = {
                                x: {
                                    min: keys.find(k => numbro(k).value > center.x),
                                    max: keys[(keys.indexOf(min)+1)]
                                },

                            }

                            console.log("The min and max are from A6",interval)
                        }
                        
                        calculateTwice()
                    } else {
                        let datachoise = dataA7
                        console.log("This data is from A7",datachoise)

                        function calculateTwice(){
                            let keys = Object.keys(datachoise)

                            let min = keys.find(k => numbro(k).value > center.x)
                            let max = keys[(keys.indexOf(min)+1)]

                            let interval = {
                                p: {
                                    min: keys.find(k => numbro(k).value > center.y),
                                    max: keys[(keys.indexOf(min)-1)]
                                },

                            }

                            console.log("The min and max are from A7",interval)
                        }
                        
                        calculateTwice()
                    }
                }
            }
            */

        }
    }




</script>



<div class="flex flex-row gap-10 items-center  ">
    
        <div class="  w-[700px] ">
            <Graph 
             data={plotedData}
             axis={axis}
             bind:center={center}/>        
        </div>
    
    <div class="flex flex-col gap-5">
        <span>
            Coordinate Input
        </span>
        <div>
            <span>

                <label class="flex items-center space-x-2 mb-3">
                    <input class="checkbox" type="checkbox" bind:checked={enforceOnePoint} />
                    <p>Enforce One Point Interpolation</p>
                </label>

            </span>
            {#if !enforceOnePoint}
                <span>
                {#if axisX != undefined}
                <select class="select" bind:value={axis[0].id} on:change={()=>{updateRanges(); updateData();}} >
                    {console.log("key", keys)}
                    
                    {#each keys as key}
                    <option value={key} >{key+" ["+units[key.replace(/[0-9]/g, "")]+']'}</option>
                    
                    {/each}
                    
                </select>
                {/if}   
                </span>
                <input type="text" name="" id="" placeholder="x-coordinate" class="input p-2 boder-1" bind:value={center.x }/>
            {/if}
        </div>
        <div>
            <span>
                {#if axisY != undefined}
                
                <select class="select" bind:value={axis[1].id} on:change={()=>{updateRanges(); updateData();}} >
                    {#each keys.slice(0,2) as key}
                    <option value={key} >{key+" ["+units[key.replace(/[0-9]/g, "")]+']'}</option>
                    {/each}
                </select>
                
                {/if}
            </span>
        <input type="text" name="" id="" placeholder="y-coordinate" class="input p-2" bind:value={center.y }/>

        </div>

        {#if isCloseToCurve}
        <table class="table table-hover border-separate border-spacing-2">
            <thead>
                <tr>
                    {#each values.x.slice(0,6) as value}
                        <th>
                            {value.variable }
                            <span class="text-xs">
                                { " ["+units[value.variable.replace(/[0-9]/g, "")]+']'}
                             </span>
                        </th>
                    {/each}
                </tr>
            </thead>
            <!-- UPPER INTERPOLATION  -->
            <tbody>
                {#if !enforceOnePoint}
                <tr>
                    {#each values.x.slice(0,6) as value}
                        <th>
                            {showNumber(value.guess)}
                        </th>
                    {/each}
                </tr>
                {/if}
                
               <!-- DOWN INTERPOLATION  -->
                <tr>
                    {#each values.y.slice(0,6) as value}
                        <th>
                            {showNumber(value.guess)}
                        </th>
                    {/each}
                </tr>
                
            </tbody>
        </table>

        <table class="table table-hover border-separate border-spacing-2">
            <thead>
                <tr>
                    {#each values.x.slice(6,12) as value}
                    <th>
                        {value.variable }
                        <span class="text-xs">
                           { " ["+units[value.variable.replace(/[0-9]/g, "")]+']'}
                        </span>
                    </th>
                    {/each}
                </tr>
            </thead>
         
            <tbody>
                <tr>
                    {#if !enforceOnePoint}
                    <tr>
                        {#each values.x.slice(6,12) as value}
                        <th>
                            {showNumber(value.guess)}
                        </th>
                        {/each}
                    </tr>
                    {/if}
                    
                </tr>
                <tr>
                    {#each values.y.slice(6,12) as value}
                    <th>
                        {showNumber(value.guess)}
                    </th>
                    {/each}
                </tr>
            </tbody>
        </table>


       


        <!--
                QUALITY CALCULATION
        -->

        <TabGroup>
            <Tab bind:group={tabSet} value={0}>
                Find Hx, Ux, Vx, Sx by Q
            </Tab>
            <Tab bind:group={tabSet} value={1}>
                Find Q by Hx, Ux, Vx, Sx
            </Tab>

            <svelte:fragment slot="panel">
                {#if tabSet === 0}

                <div class="flex flex-col gap-3">
                    <RangeSlider name="range-slider"  max={1} step={0.0001} bind:value={quality} ticked>Quality</RangeSlider>

                    <input type="text" name="" id="" placeholder="x-coordinate" class="input p-2 boder-1" bind:value={quality }/>
    
                    <table class="table table-hover border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th>
                                    Hx
                                </th>
                                <th>
                                    Ux
                                </th>
                                <th>
                                    Vx
                                </th>
                                <th>
                                    Sx
                                </th>
            
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>
                                {
                                    showNumber(
                                        Number(values.x.find(v => v.variable === "H1").guess)+
                                        (Number(values.x.find(v => v.variable === "H2").guess)-Number(values.x.find(v => v.variable === "H1").guess))*quality
                                    )
                                
                                }
                                <th>
                                {
                                    showNumber(
                                        Number(values.x.find(v => v.variable === "U1").guess)+
                                        (Number(values.x.find(v => v.variable === "U2").guess)-Number(values.x.find(v => v.variable === "U1").guess))*quality
                                    )
                                
                                }
                                </th>
                                <th>
                                {
                                    showNumber(
                                        Number(values.x.find(v => v.variable === "Ve1").guess)+
                                        (Number(values.x.find(v => v.variable === "Ve2").guess)-Number(values.x.find(v => v.variable === "Ve1").guess))*quality
                                    )
                                }
                                </th>
                                <th>
                                {
                                    showNumber(
                                        Number(values.x.find(v => v.variable === "S1").guess)+
                                        (Number(values.x.find(v => v.variable === "S2").guess)-Number(values.x.find(v => v.variable === "S1").guess))*quality
                                    )
                                    
                                }
                                </th>
                            </tr>
            
                            <tr>
                                <th>
                                {
                                    showNumber(
                                        Number(values.y.find(v => v.variable === "H1").guess)+
                                        (Number(values.y.find(v => v.variable === "H2").guess)-Number(values.y.find(v => v.variable === "H1").guess))*quality
                                    )
                                
                                }
                                <th>
                                {
                                    showNumber(
                                        Number(values.y.find(v => v.variable === "U1").guess)+
                                        (Number(values.y.find(v => v.variable === "U2").guess)-Number(values.y.find(v => v.variable === "U1").guess))*quality
                                    )
                                
                                }
                                </th>
                                <th>
                                {
                                    showNumber(
                                        Number(values.y.find(v => v.variable === "Ve1").guess)+
                                        (Number(values.y.find(v => v.variable === "Ve2").guess)-Number(values.y.find(v => v.variable === "Ve1").guess))*quality
                                    )
                                }
                                </th>
                                <th>
                                {
                                    showNumber(
                                        Number(values.y.find(v => v.variable === "S1").guess)+
                                        (Number(values.y.find(v => v.variable === "S2").guess)-Number(values.y.find(v => v.variable === "S1").guess))*quality
                                    )
                                    
                                }
                                </th>
                            </tr>
                        </tbody>
                    </table>
                </div>

                

                {:else if tabSet === 1}
                <div class="flex flex-row gap-5">
                    <select   class="select basis-1/4" bind:value={thermoForQuality}>
                        <option value="H" >Hx {"["+units['H'] + "]"}</option>
                        <option value="U">Ux {"["+units['U'] + "]"}</option>
                        <option value="Ve">Vx {"["+units['Ve'] + "]"}</option>
                        <option value="S">Sx {"["+units['S'] + "]"}</option>
                      </select>
                      <select  class="select basis-1/4" bind:value={selectQualityBy}>


                        {#if enforceOnePoint}
                            
                            <option value={axis[0].type} >By {axis[0].id}</option>
                            
                        {:else}
                            {#each axis as ax}
                            <option value={ax.type} >By {ax.id}</option>
                            {/each}
                        {/if}
                        
                        
                        
                      </select>
                    <input type="text" name="" id=""  class="input p-2 boder-1 basis-3/4" bind:value={midValue} />
                    
                    
                </div>
                <div class="m-10">

                    Quality
                    {#if selectQualityBy !== undefined}
                        
                        {
                            showNumber(
                            (Number(numbro(midValue).value()) -
                            Number(values[selectQualityBy].find(v => v.variable === thermoForQuality+"1").guess))/
                            (-Number(values[selectQualityBy].find(v => v.variable === thermoForQuality+"1").guess)+Number(values[selectQualityBy].find(v => v.variable === thermoForQuality+"2").guess))
                            )
                        }

                        {#if !isIn(showNumber(
                            (Number(numbro(midValue).value()) -
                            Number(values[selectQualityBy].find(v => v.variable === thermoForQuality+"1").guess))/
                            (-Number(values[selectQualityBy].find(v => v.variable === thermoForQuality+"1").guess)+Number(values[selectQualityBy].find(v => v.variable === thermoForQuality+"2").guess))
                            ),[0,1]) } 
                        Value not in range, result is meaningless
                        {/if}
                       
                    {/if}

                    
                    

                </div>
                    
                {:else if tabSet === 2}
                    
                <div></div>
			
                {/if}
            </svelte:fragment>
        </TabGroup>

        {/if}

        
    </div>
    

</div>
