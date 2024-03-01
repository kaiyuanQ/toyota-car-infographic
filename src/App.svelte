<script>
  import MainPage from "./lib/MainPage.svelte";
  import queryString from "query-string";
  // import { data } from "./lib/stores.js";
  import { onMount } from "svelte";
  let path = location.pathname.replace(/[^/]*$/, "");
  let screenSize = window.innerWidth;

  if (window.location.hostname === "localhost") {
    path = "/";
  }

  let isLoading = false;
  let dataObj = null;

  onMount(() => {
    loadJson();
  });

  async function loadJson() {
    isLoading = true;
    const nameJson = queryString.parse(location.search).name
      ? queryString.parse(location.search).name
      : "label";
    const url = `${path}data/${nameJson}.json?${new Date().getTime()}`;

    await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(async (response) => {
      dataObj = await response.json();
      console.log(dataObj);
    });
    isLoading = false;
  }
</script>

<svelte:window bind:innerWidth={screenSize} />
{#if dataObj}
  <MainPage {path} {dataObj} {screenSize}/>
{/if}

