<svelte:options immutable={true} />

<script>
  // @ts-ignore
  import Scroller from "@sveltejs/svelte-scroller";
  import Header from "./components/Header.svelte";
  import Footer from "./components/Footer.svelte";
  import { onMount } from "svelte";
  import posthog from "posthog-js";
  import typewriter from "./animation/typewriter";
  import { fade } from "svelte/transition";
  import { inview } from "svelte-inview";
  import HorizontalBar from "./components/HorizontalBar.svelte";

  posthog.init("phc_YEgCBDsU3KK8IyDLOMF8JHpvn65KkHBRgSNqeMZKGOz", {
    api_host: "https://app.posthog.com",
  });

  let count;
  let index;
  let offset;
  let progress;
  let top = 0.1;
  let threshold = 1;
  let bottom = 0.9;

  export let dataObj;
  export let path;
  export let screenSize;
  let isInView = false;
  let barInView = false;

  onMount(() => {
    if (index) {
      posthog.capture("scroll", { index: index });
    }
  });
</script>

<div
  class="main-page-container"
  style:--themeColor={dataObj.scrollyBoxTheme.themeBgColor}
  style:--themetextColor={dataObj.scrollyBoxTheme.themeTextCollor}
>
  <Header />

  <div class="first-screen-container">
    <div class="top-header-screen">
      <h1 class="header-title">
        <span>{dataObj.firstScreen.title1}</span>
        <span>{dataObj.firstScreen.title}</span>
      </h1>
      <div class="producedby">
        <p>{dataObj.firstScreen.by}</p>
      </div>
      <div class="header-image-container">
        <img src={`${path}images/main_desktop.webp?v2`} alt="main" />
      </div>
    </div>

    <div class="header-desc">
      {#each dataObj.firstScreen.desc as d}
        <p>{@html d}</p>
      {/each}
    </div>

    <div class="explore-container">
      <img
        class="scroll-icon"
        src={`${path}images/explore.gif?v1`}
        alt="explore"
      />
      <p class="scroll-text">{dataObj.firstScreen.scrollText}</p>
    </div>
  </div>

  {#if isInView === false}
    <div class="car-animation-container" transition:fade>
      <div class="container-div">
        <img src={`${path}images/car.webp?v1`} alt="running car" />
      </div>
    </div>
  {/if}

  <Scroller
    {top}
    {threshold}
    {bottom}
    bind:count
    bind:index
    bind:offset
    bind:progress
  >
    <div slot="background">
      <div class="background-right-container">
        <div class="empty-div"></div>
        <div
          class="right-div"
          style:background={`url(${path}images/receipt.webp) no-repeat`}
          style:background-size={"100% 100%"}
        >
          <div class="background-right">
            <div class="title-case-study" out:fade>
              {dataObj.caseStudy.title}
            </div>
            <div class="divider-case-study"></div>
            {#each dataObj.scrollytelling as data}
              {#if index + 1 >= data.id && data.price && data.price !== ""}
                <div
                  class="background-cost"
                  class:isRetail={data.priceT === "Retail price"}
                  in:typewriter={{ speed: 25 }}
                  out:fade
                >
                  <p>{data.priceT}</p>
                  <p>{data.price}</p>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      </div>
      <!-- <div class="car-animation-container">
        <div class="container-div">
          <img src={`${path}images/car.webp`} alt="running car" />
        </div>
      </div> -->
    </div>

    <div slot="foreground" class="scrollytelling-container">
      {#each dataObj.scrollytelling as data}
        <section class={`story-section story-${data.id}`}>
          <div class="story-desc">
            {#if data.title}
              <p class="story-title">{data.title}</p>
            {/if}
            {#if data.desc.length > 0}
              {#each data.desc as d}
                <p class="desc">{@html d}</p>
              {/each}
            {/if}

            {#if data.img && data.img !== ""}
              <img src={`${path}images/${data.img}`} alt="table" />
            {/if}

            {#if data.notes && data.notes !== ""}
              <div class="notes">
                <p>{@html data.notes}</p>
              </div>
            {/if}
          </div>
        </section>
      {/each}
    </div>
  </Scroller>

  <div
    class="static-section-container"
    use:inview
    on:inview_enter={(event) => {
      const { inView } = event.detail;
      console.log("here");

      isInView = inView;
    }}
    on:inview_leave={(event) => {
      const { inView } = event.detail;
      isInView = inView;
    }}
  >
    {#each dataObj.staticSection as s}
      <div class={`static-${s.id}-section static-section`}>
        {#if s.title}
          <p class="static-title">{s.title}</p>
        {/if}

        {#if s.overviewTable}
          <div class="table-title">
            <p>{s.overviewTable.title}</p>
          </div>
          <table>
            <thead>
              <tr>
                {#each s.overviewTable.header as header}
                  <td>
                    {header.desc}
                  </td>
                {/each}
              </tr>
            </thead>

            <tbody>
              {#each s.overviewTable.tableData as data}
                <tr>
                  {#each s.overviewTable.header as header}
                    <td>
                      {#if header.id !== "0"}
                        <div class="mobile-only">
                          {@html header.descM ? header.descM : header.desc}
                        </div>
                      {/if}

                      <div>{data[header.csvT]}</div>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
        {#if s.notes}
          <p class="static-notes">{@html s.notes}</p>
        {/if}
        <div class="static-desc-container">
          {#if s.topDesc.length > 0}
            <div class="paragraph-container">
              {#each s.topDesc as desc}
                <p>{desc}</p>
              {/each}
            </div>
          {/if}
          {#if s.overviewChart}
            <div
              class="bar-chart-container"
              use:inview
              on:inview_enter={(event) => {
                const { inView } = event.detail;
                barInView = inView;
              }}
              on:inview_leave={(event) => {
                const { inView } = event.detail;
                barInView = inView;
              }}
            >
              <HorizontalBar
                data={s.overviewChart.data}
                xVar={"value"}
                yVar={"name"}
                screenWidth={screenSize}
                {barInView}
              />
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="end-section-container">
    {#if dataObj.endSection.methodologyText && dataObj.endSection.methodologyText !== ""}
      <div class="methodology-container">
        <p class="methodology-title">{@html dataObj.endSection.methodology}</p>
        <p class="methodology-text">
          {@html dataObj.endSection.methodologyText}
        </p>
      </div>
    {/if}

    {#if (dataObj.endSection.readMoreUrl && dataObj.endSection.readMoreUrl.length > 0) || (dataObj.endSection.pdfLink && dataObj.endSection.pdfLink !== "")}
      <div class="readMore-container">
        <p class="readMore-title">{@html dataObj.endSection.readMore}</p>
        {#if dataObj.endSection.readMoreUrl.length > 0}
          {#each dataObj.endSection.readMoreUrl as links}
            <div class="links-container">
              <a class="readMore-links" href={links.url} target="_blank">
                {links.text}</a
              >
            </div>
          {/each}
        {/if}

        {#if dataObj.endSection.pdfLink !== ""}
          <div class="pdf-link-container">
            <img src={`${path}images/pdf_icon.webp`} alt="pdf" />
            <a
              class="pdf-link"
              href={dataObj.endSection.pdfLink}
              target="_blank"
            >
              {dataObj.endSection.pdfText}</a
            >
          </div>
        {/if}
      </div>
    {/if}

    <div class="source-container">
      {#each dataObj.endSection.source as source}
        <p class="source-text">{@html source.text}</p>
      {/each}
    </div>
  </div>
  <Footer label={dataObj} />
</div>

<style>
</style>
