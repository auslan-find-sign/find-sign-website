<script lang="ts">
  import type { PageData } from "./$types"
  import MainBlock from "$lib/MainBlock.svelte"
  import { LayerCake, Svg, Html, Canvas } from "layercake"
  import { chunk, times } from "$lib/functions/iters"
	import AxisX from "$lib/charts/AxisX.svelte"
	import AxisY from "$lib/charts/AxisY.svelte"
	import Line from "$lib/charts/Line.svelte"
	import Area from "$lib/charts/Area.svelte"

  export let data: PageData

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  $: points = data.days.map((y, x) => ({ x, y }))

	$: secondsInYear = (Date.UTC(data.year + 1, 0, 1, 0, 0, 0, 0) - Date.UTC(data.year, 0, 1, 0, 0, 0, 0)) / 1000
	$: daysInYear = secondsInYear / 60 / 60 / 24
	$: highestValue = data.days.reduce((x,y) => Math.max(x,y), 0)

  const AvgDays = 14
	$: avg = [...times(data.days.length, idx => {
		const weekSamples = data.days.slice(
			Math.max(0, (Math.floor(idx - (AvgDays / 2)))),
			Math.min(data.days.length - 1, Math.ceil(idx + (AvgDays / 2)))
		)
		return { dayOfYear: idx, value: weekSamples.reduce((p,c) => p + c, 0) / weekSamples.length}
	})]
</script>

<MainBlock wide>
  <h1>“{data.topic}” requests in {data.year}</h1>

	<div class="chart">
		<LayerCake padding={{ right: 10, bottom: 20, left: 25 }} x='x' y='y' yDomain={[0, null]} data={points}>
			<Svg>
				<AxisX ticks={12} />
				<AxisY ticks={8} />
				<Line/>
				<Area/>
			</Svg>
		</LayerCake>
	</div>
</MainBlock>

<style>
	.chart {
		height: 300px;
		width: auto;
	}
</style>