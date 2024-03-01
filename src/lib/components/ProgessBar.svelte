<script>
    import { tweened } from "svelte/motion";
    import { cubicOut } from "svelte/easing";
    import { createEventDispatcher } from "svelte";

    export let progressV = 0.1;
    export let data;
    export let currentI;


	const dispatch = createEventDispatcher();

    $: progress.set(progressV);

    const progress = tweened(0, {
        duration: 500,
        easing: cubicOut,
    });

    let clientWidth = {};
    $: lineWidth =
        clientWidth &&
        clientWidth["story1"] / 2 +
            clientWidth[`story${data["totalStory"]}`] / 2;

    const handleOnClick = (e) => {
        dispatch("dotOnClick", {
			storyId: e
		});
    }
</script>

<div class="timeline">
    <div class="outer-container" style:width={`calc(100% - ${lineWidth}px)`}>
        <div class="inner-container" style={`width: ${$progress * 100}%`} />
    </div>
    <div class="title-container">
        {#each { length: data["totalStory"] } as _, i}
            {@const storyId = `story${i + 1}`}
            <div style:width={`calc(100% / ${data["totalStory"]})`}>
                <div class="timeline-dots-container">
                    <button
                        class="timeline-dots-active"
                        class:active={currentI === i}
                        on:click={() => handleOnClick(i)}
                    />
                    <button
                        class="timeline-dots"
                        class:active={currentI >= i}
                        on:click={() => handleOnClick(i)}
                    />
                </div>

                <div
                    class="title"
                    class:active={currentI === i}
                    bind:clientWidth={clientWidth[storyId]}
                >
                    {@html data[storyId].title}
                </div>
            </div>
        {/each}
    </div>
</div>
