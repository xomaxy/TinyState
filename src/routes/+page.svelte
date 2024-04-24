<script>
    import Hope from "./Hope.svelte"
    import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
    import {csv, scaleLinear, dsv, interpolate} from "d3";


    let tabSet = 0;
    let dataA6, dataA7, underPreasure,underThermo,guessThermo;
    let state = "Liquid"
    let thermovar = "T"
    let interval;

function isIn(number, range) {
  const [min, max] = range[0] < range[1] ? range : [range[1], range[0]];
  return number >= min && number <= max;
}

// Load data with magic 

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

console.log("Casting")

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



function calculateState(state, underThermo){
    let data = state == "Liquid" ? dataA6: dataA7
    console.log(dataA6, dataA7)
    let keys =  Object.keys(data).map( text => Number(text)).sort((a,b) => a-b)
    console.log("Preasure values are",keys)
    let tonum = Number(underPreasure)
    let numunderThermo = Number(underThermo)

// range control
        if (tonum < keys[0] || tonum > keys[keys.length-1])  {
            console.log("Out of range")
    
        } else if (tonum == keys[0]) {
            console.log("Low tip")

        } else if (tonum == keys[keys.length]){
            console.log("High tip")

        } else {
            interval = {
                preasure: {
                    low:keys[keys.indexOf(keys.find( presure => Number(presure) >= Number(underPreasure)))-1] ,
                    high:keys.find( presure => Number(presure) >= Number(underPreasure)),
                    percentaje: (tonum - keys.find( presure => Number(presure) >= Number(underPreasure))) / (keys[keys.indexOf(keys.find( presure => Number(presure) >= Number(underPreasure)))-1] - keys.find( presure => Number(presure) >= Number(underPreasure)))

                },

            }

            interval.thermodata = {
                thermo_low: data[`${interval.preasure.low}`],
                thermo_high: data[`${interval.preasure.high}`]

            }

            interval.thermodata.interpolate = {
                guess: (() => {
                    let guess = {}
                    Object.keys(interval.thermodata.thermo_low).forEach( 
                        thermoProp => {
                        guess[thermoProp] = interval.thermodata.thermo_low[thermoProp].map((lowval, index) => {
                            try{
                                return Number(lowval) + (Number(interval.thermodata.thermo_high[thermoProp][index])-Number(lowval))*interval.preasure.percentaje
                            }
                            catch(e){
                                return 0
                            }
                            
                        }
                        )
                    })
                    return guess
                })()
            }


            
            if(underThermo !== undefined && thermovar !== undefined && interval !== undefined){
                // SI ESTA ADENTRO
               if (isIn(numunderThermo, [
                    Math.max(...interval.thermodata.interpolate.guess[thermovar]),
                    Math.min(...interval.thermodata.interpolate.guess[thermovar])
                                ]))
                {
                    console.log("is inside")
                    
                    
                    let high =interval.thermodata.interpolate.guess[thermovar].find(val => val > numunderThermo)
                    let low = interval.thermodata.interpolate.guess[thermovar][interval.thermodata.interpolate.guess[thermovar].indexOf(high) -1] || 0
                    let index = interval.thermodata.interpolate.guess[thermovar].indexOf(high)
                    console.log(index)
                    console.log(index-1)
                    guessThermo = numunderThermo/(Number(high)-Number(low)) 

                    let lows = {}

                    for (const [key,value] of Object.entries(interval.thermodata.interpolate.guess)){

                        if(thermovar == key){
                            lows[thermovar] = (value[index] - value[index-1])*guessThermo
                        } else {
                            lows[key] = (value[index] - value[index-1])*guessThermo  + value[index-1]
                        }
                        

                    }

                    console.log("Lows are", lows)

                    interval.thermodata.interpolate.lows = lows



                } else {
                    console.log("is outside")
                }
            }
        }

       


    
}


$: {if (dataA6 !== undefined && dataA7 !== undefined && underPreasure !== undefined) {
    
    calculateState(state,underThermo)
}}

</script>



<TabGroup>
	<Tab bind:group={tabSet} name="tab1" value={0}>
		<span>
            Vapor - Liquid Mixture
        </span>
	</Tab>
	<Tab bind:group={tabSet} name="tab2" value={1}>
        <span>
            Saturated Vapor and Compressed liquid
        </span>
    </Tab>

	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 0}
        <Hope/>
		{:else if tabSet === 1}
        <div class="flex flex-col gap-5">

            <span>
                Input Pressure
            </span>
            <input type="text" name="" id=""  class="input p-2 boder-1 basis-3/4" bind:value={underPreasure} />
            <select class="select" bind:value={state} >
                <option>Liquid</option>
                <option>Gas</option>
            </select>
    
            <select class="select" bind:value={thermovar} >
                <option>T</option>
                <option>V</option>
                <option>U</option>
                <option>H</option>
                <option>S</option>
            </select>
            <input type="text" name="" id=""  class="input p-2 boder-1 basis-3/4" bind:value={underThermo} />
    
    
            <table class="table table-hover border-separate border-spacing-2">
                <thead>
                    <tr>
                        <th>Property</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
    
                    {#if interval != undefined && underThermo != undefined}
                    {#each Object.entries(interval.thermodata.interpolate.lows) as [prop, value]}
                        <tr>
                            <th>{prop}</th>
                            <th>{value}</th>
                        </tr>
     
                    {/each}
                    {:else}
                        Out of Range
                    {/if}
                    
                </tbody>
            </table>
        </div>

		{/if}
	</svelte:fragment>
</TabGroup>
			


