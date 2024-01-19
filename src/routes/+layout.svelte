<script>
    import "../app.css";
 
    import { onMount } from "svelte";
    import { autoModeWatcher } from '@skeletonlabs/skeleton';

    import { LightSwitch } from '@skeletonlabs/skeleton';

    onMount(() => {										
        autoModeWatcher();
    })
</script>

<LightSwitch/>
  
<slot />


