<script context="module">
    export let svg;

    const _viewBox = writable({min_x: 0, min_y: 0, width: 500, height: 500})
    const _margin = writable({top: 20, right: 30, bottom: 50, left: 50})
    const _domain = writable({x: [0,1], y: [0,1]})

    
    export const xScale = derived([_domain,_viewBox,_margin],([$_domain,$_viewBox,$_margin])=>scaleLinear()
                                                .domain($_domain.x)
                                                .range([$_margin.left, $_viewBox.width - $_margin.right])
                        )
    export const yScale = derived([_domain,_viewBox, _margin],([$_domain,$_viewBox,$_margin])=>scaleLinear()
                                                .domain($_domain.y)
                                                .range([$_viewBox.height - $_margin.bottom, $_margin.top])
                           );

</script>
<script>

    import {scaleLinear} from 'd3';
    import {setContext} from 'svelte';
    import {writable, derived} from 'svelte/store';
    export let className = "";
    export let viewBox={};
    export let domain={};
    export let margin = {}

    $: _viewBox.update(($_viewBox)=>{return {...$_viewBox, ...viewBox}})
    $: _domain.update(($_domain)=>{return {...$_domain, ...domain}})
    $: _margin.update(($_margin)=>{return {...$_margin, ...margin}})

    setContext('viewBox', _viewBox)
    setContext('domain', _domain)
    setContext('xScale', xScale)
    setContext('yScale', yScale)

</script>


    <svg bind:this={svg} viewBox='{$_viewBox.min_x} {$_viewBox.min_y} {$_viewBox.width} {$_viewBox.height}' class="{className}"> 
        <slot/>
    </svg>




