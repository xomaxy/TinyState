<script>
    import "../app.css";
 
    import { onMount } from "svelte";
    import { autoModeWatcher } from '@skeletonlabs/skeleton';

    import { LightSwitch, AppShell, AppBar } from '@skeletonlabs/skeleton';

    onMount(() => {										
        autoModeWatcher();
    })
</script>


  
<AppShell>
    <svelte:fragment slot="header">
        <AppBar>
            <svelte:fragment slot="trail">
                <LightSwitch/>
            </svelte:fragment>
            <svelte:fragment slot="lead">
                <span class="italic text-xl font-mono">
                    TinyState
                </span>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>
    <div class=" flex flex-col items-center m-10">
        <slot />
    </div>
</AppShell>   





