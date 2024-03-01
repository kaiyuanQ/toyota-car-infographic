import { cubicInOut } from "svelte/easing";

export default function font(node, {
    delay = 0,
    duration = 400,
    easing = cubicInOut,
    fontSize = `1.5rem`
}) {
    return {
        delay,
        duration,
        easing,
        css: (t) => {
            return `
            fontSize
            `
        }
    }
}