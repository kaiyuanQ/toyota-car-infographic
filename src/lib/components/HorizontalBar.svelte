<script>
    import * as d3 from "d3";

    export let data;
    export let xVar;
    export let yVar;
    export let screenWidth;
    export let barInView;
    import { fly } from "svelte/transition";

    const formatLabel = d3.format(",.0f");

    const margin = {
        top: 0,
        right: 60,
        bottom: 0,
        left: 0,
    };

    let width = 1066 / 2;

    $: innerWidth = width - margin.left - margin.right;

    $: xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[xVar])])
        .range([0, innerWidth]);
</script>

{#key screenWidth}
    <div class="horizontal-bar-container" bind:clientWidth={width}>
        {#key barInView}
            {#each data as d}
                <div class="bar-title">{d[yVar]}</div>
                <div class="bar-container">
                    <div
                        class={"bar"}
                        style="background-color: #007bad;"
                        style:width={`${xScale(d[xVar])}px`}
                    />

                    <div class="bar-value">{d[xVar]}</div>
                </div>
            {/each}
        {/key}
    </div>
{/key}
