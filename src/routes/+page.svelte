<script>
    import Graph from "./Graph.svelte";
    import {csv, interval, scaleLinear} from "d3"
    import { Slice } from "lucide-svelte";

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


    let center = {x: 0, y: 0}
    
    let values = {x:[],y:[]};

    let axis = [{type: "x", label:"Temperatura", id:"T" , domain:undefined},
                {type: "y", label:"Presión", id:"P", domain:undefined}];


    // Mutable data
    let axisX, axisY;
    let rawData;
    let keys;
    let plotedData;
    let isCloseToCurve;

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
        
    })

    


    $: {
        if(center.x != undefined && center.y != undefined && rawData!= undefined){
            if (isIn(center.x, axisX.domain) && isIn(center.y, axisY.domain)){


                
                let intervalPoint = {
                    X: 
                    [
                        rawData.find(point => Number(point[axisX.id]) >= center.x ),
                        rawData[rawData.indexOf(
                            rawData.find(point => Number(point[axisX.id]) >= center.x )
                        )-1]
                    ]
                    ,
                    Y:
                    [
                        rawData.find(point => Number(point[axisY.id]) >= center.y ),
                        rawData[rawData.indexOf(
                            rawData.find(point => Number(point[axisY.id]) >= center.y )
                        )-1]
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

                //let normVale = scales[0].invert(center.x)

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

                let distance = distanceToLine([center.x,center.y],[
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
                ])

                isCloseToCurve = distance < 10

                console.log("Is close?",isCloseToCurve)

            }
        }
    }



</script>



<div class="flex flex-row gap-10 items-center flex-nowrap ">
    
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
        <input type="text" name="" id="" placeholder="x-coordinate" class="input p-2 boder-1" bind:value={center.x }/>
        <input type="text" name="" id="" placeholder="y-coordinate" class="input p-2" bind:value={center.y }/>

        {#if isCloseToCurve}
        <table class="table table-hover border-separate border-spacing-2">
            <thead>
                <tr>
                    {#each values.x.slice(0,6) as value}
                        <th>
                            {value.variable}
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {#each values.x.slice(0,6) as value}
                        <th>
                            {showNumber(value.guess)}
                        </th>
                    {/each}
                </tr>
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
                        {value.variable}
                    </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {#each values.x.slice(6,12) as value}
                    <th>
                        {showNumber(value.guess)}
                    </th>
                    {/each}
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
        {/if}

        
    </div>
    

</div>
