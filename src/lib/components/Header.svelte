<script>
    import * as Shareon from "shareon";
    import "shareon/css";
    import { onMount } from "svelte";

    onMount(() => {
        Shareon.init();
    });

    const handleOnClickBt = () => {
        window.open("https://www.businesstimes.com.sg/");
    };
</script>

<div class="header-container" id="header-container">
    <div class="header-bar">
        <div class="logos-container">
            <button on:click={() => handleOnClickBt()} class="btlogo" />
        </div>
        <div class="share-button-container">
            <div class="shareon" data-url={window.location.href}>
                <a class="facebook" href={window.location.href}> </a>
                <a class="twitter" href={window.location.href}> </a>
                <a class="linkedin" href={window.location.href}> </a>
            </div>
        </div>
    </div>
</div>
