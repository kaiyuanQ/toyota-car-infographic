<script>
	import Siema from "siema";
	import { onMount, createEventDispatcher } from "svelte";

	export let className = "carousel";
	export let perPage = 1;
	export let loop = true;
	export let autoplay = 0;
	export let duration = 400;
	export let easing = "ease-out";
	export let startIndex = 0;
	export let draggable = false;
	export let multipleDrag = true;
	export let dots = true;
	export let controls = true;
	export let threshold = 0;
	export let rtl = false;
	let currentIndex = startIndex;

	let siema;
	let controller;
	let timer;
	const dispatch = createEventDispatcher();

	$: pips = controller ? controller.innerElements : [];
	$: currentPerPage = controller ? controller.perPage : perPage;
	$: totalDots = controller
		? Math.ceil(controller.innerElements.length / currentPerPage)
		: 0;

	onMount(() => {
		controller = new Siema({
			selector: siema,
			perPage: typeof perPage === "object" ? perPage : Number(perPage),
			loop,
			duration,
			easing,
			startIndex,
			draggable,
			multipleDrag,
			threshold,
			rtl,
			onChange: handleChange,
		});

		if (autoplay) {
			timer = setInterval(right, autoplay);
		}
		return () => {
			autoplay && clearInterval(timer);
			controller.destroy();
		};
	});

	export function isDotActive(currentIndex, dotIndex) {
		if (currentIndex < 0) currentIndex = pips.length + currentIndex;
		return (
			currentIndex >= dotIndex * currentPerPage &&
			currentIndex < dotIndex * currentPerPage + currentPerPage
		);
	}

	export function left() {
		controller.prev();
	}

	export function right() {
		controller.next();
	}

	export function go(index) {
		controller.goTo(index);
	}

	export function pause() {
		clearInterval(timer);
	}

	export function resume() {
		if (autoplay) {
			timer = setInterval(right, autoplay);
		}
	}

	function handleChange(event) {
		currentIndex = controller.currentSlide;
		dispatch("change", {
			currentSlide: controller.currentSlide,
			slideCount: controller.innerElements.length,
		});
	}

	function resetInterval(node, condition) {
		function handleReset(event) {
			pause();
			resume();
		}

		if (condition) {
			node.addEventListener("click", handleReset);
		}

		return {
			destroy() {
				node.removeEventListener("click", handleReset);
			},
		};
	}
</script>

<div class={className}>
	<div class="slides" bind:this={siema}>
		<slot />
	</div>
	{#if controls}
		<button
			class="left"
			on:click={left}
			use:resetInterval={autoplay}
			aria-label="left"
			class:show={loop || currentIndex + 1 !== 1}
		>
			<slot name="left-control" />
		</button>

		<button
			class="right"
			on:click={right}
			use:resetInterval={autoplay}
			aria-label="right"
			class:show={loop || currentIndex + 1 !== totalDots}
		>
			<slot name="right-control" />
		</button>
	{/if}
	{#if dots && totalDots > 1}
		<div class="dots-container">
			{#each { length: totalDots } as _, i}
				<button
					on:click={() => go(i * currentPerPage)}
					class={isDotActive(currentIndex, i) ? "active" : ""}
				/>
			{/each}
		</div>
	{/if}
</div>
