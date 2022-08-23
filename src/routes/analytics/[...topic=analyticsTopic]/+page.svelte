<script lang="ts">
  import type { PageData } from "./$types"
  import MainBlock from "$lib/MainBlock.svelte"
  import { LayerCake, Svg, Html, Canvas } from "layercake"
  import { chunk, times } from "$lib/functions/iters"
	import AxisX from "$lib/charts/AxisX.svelte"
	import AxisY from "$lib/charts/AxisY.svelte"
	import Line from "$lib/charts/Line.svelte"
	import Area from "$lib/charts/Area.svelte"
	import Header from "$lib/header/Header.svelte"

  export let data: PageData

	$: yearStartMs = Date.UTC(data.year, 0)
	$: yearMonthTicks = [...times(12, month => {
		const monthStartMs = Date.UTC(data.year, month)
		return (monthStartMs - yearStartMs) / (24 * 60 * 60 * 1000)
	})]

	const yearMonthFormat = (dayOfYear) => {
		const tickDate = new Date(yearStartMs + (dayOfYear * 24 * 60 * 60 * 1000))
		const utcMonth = tickDate.getUTCMonth()
		return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][utcMonth]
	}


  $: points = data.days.map((y, x) => ({ x, y }))
	$: total = data.days.reduce((x, y) => x + y, 0)

	$: avgDayPoints = data.avgDay.map((y, x) => ({ x: x / 60, y }))

	$: avgWeekPoints = data.avgWeek.map((y, x) => ({ x: x / 24, y }))

	$: console.log(avgWeekPoints)
</script>

<svelte:head>
	<title>“{data.topic}” Analytics</title>
</svelte:head>

<Header />

<MainBlock wide>
  <h1>“{data.topic}” requests in {data.year}</h1>

	<div class="year-links">
		<a href="?year={data.year - 1}">⋖ {data.year - 1}</a>
		<span>{data.year}</span>
		<a href="?year={data.year + 1}">{data.year + 1} ⋗</a>
	</div>

	<div class="chart">
		<LayerCake padding={{ right: 10, bottom: 20, left: 25 }} x='x' y='y' data={points}>
			<Svg>
				<AxisX ticks={yearMonthTicks} formatTick={yearMonthFormat} />
				<AxisY ticks={8} />
				<Line stroke='currentColor' />
				<Area/>
			</Svg>
		</LayerCake>
	</div>

	<h1>Average Day in {data.year}</h1>

	<div class="chart">
		<LayerCake padding={{ right: 10, bottom: 20, left: 40 }} x='x' y='y' data={avgDayPoints}>
			<Svg>
				<AxisX ticks={24} formatTick={t =>
					[
						'12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am',
						'12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'
					][t]
				}/>
				<AxisY ticks={8} />
				<Line stroke='currentColor' />
				<Area />
			</Svg>
		</LayerCake>
	</div>

	<h1>Average Week in {data.year}</h1>

	<div class="chart">
		<LayerCake padding={{ right: 10, bottom: 20, left: 25 }} x='x' y='y' data={avgWeekPoints}>
			<Svg>
				<AxisX ticks={7} formatTick={t => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][t]} />
				<AxisY ticks={8} />
				<Line  stroke='currentColor' />
				<Area/>
			</Svg>
		</LayerCake>
	</div>

	<p>Total hits in {data.year}: {total}</p>
</MainBlock>

<style>
	.chart {
		height: 300px;
		width: auto;
	}

	.year-links {
		display: flex;
		justify-content: space-between;
		margin: 2em 0;
	}
</style>