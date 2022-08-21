<script lang="ts">
  import type { PageData } from "./$types"
  import MainBlock from "$lib/MainBlock.svelte"
  import * as Pancake from "@sveltejs/pancake"
  import { chunk } from "$lib/functions/iters"

  export let data: PageData

  // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  // $: yearStartMs = Date.UTC(data.year, 0, 1, 0, 0, 0, 0)
  $: points = data.days.map((x, idx) => {
    return { dayOfYear: idx, value: x }
  })

	$: secondsInYear = (Date.UTC(data.year + 1, 0, 1, 0, 0, 0, 0) - Date.UTC(data.year, 0, 1, 0, 0, 0, 0)) / 1000
	$: daysInYear = secondsInYear / 60 / 60 / 24
	$: highestValue = data.days.reduce((x,y) => Math.max(x,y), 0)

  const DaysInWeek = 7
  $: weeks = chunk(data.days, DaysInWeek).map((values: number[], week: number) => {
    const avg = values.reduce((prev, current) => prev + current, 0) / values.length
    return { weekOfYear: week, value: avg }
  })
</script>

<MainBlock wide>
  <h1>{data.topic} hits in {data.year}</h1>

	<h4>days in year {daysInYear}</h4>

  <div class="chart">
		<Pancake.Chart x1={0} x2={daysInYear} y1={0} y2={highestValue}>
			<Pancake.Grid horizontal count={10} let:value>
				<div class="grid-line horizontal"><span>{value}</span></div>
			</Pancake.Grid>

			<Pancake.Grid vertical count={12} let:value>
				<div class="grid-line vertical"></div>
				<span class="year-label">{value}</span>
			</Pancake.Grid>

			<Pancake.Svg>
				<Pancake.SvgScatterplot data={points} x={d => d.dayOfYear} y={d => d.value} let:d>
					<path class="avg scatter" {d}/>
				</Pancake.SvgScatterplot>

				<!-- <Pancake.SvgLine data={weeks} x="{d => d.weekOfYear}" y="{d => d.value}" let:d>
					<path class="avg" {d}/>
				</Pancake.SvgLine> -->
			</Pancake.Svg>
		</Pancake.Chart>
  </div>
</MainBlock>

<style>
	.chart {
		height: 300px;
		padding: 3em 0 2em 2em;
		margin: 0 0 36px 0;
		margin: 0 auto;
	}

	.grid-line {
		position: relative;
		display: block;
	}

	.grid-line.horizontal {
		width: calc(100% + 2em);
		left: -2em;
		border-bottom: 1px dashed #ccc;
	}

	.grid-line.vertical {
		height: 100%;
		border-left: 1px dashed #ccc;
	}

	.grid-line span {
		position: absolute;
		left: 0;
		bottom: 2px;
		line-height: 1;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
	}

	.year-label {
		position: absolute;
		width: 4em;
		left: -2em;
		bottom: -30px;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
		text-align: center;
	}

	.text {
		position: absolute;
		width: 15em;
		line-height: 1;
		color: #666;
		transform: translate(0,-50%);
		text-shadow: 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white, 0 0 8px white;
	}

	.text p {
		margin: 0;
		line-height: 1.2;
		color: #999;
	}

	.text h2 {
		margin: 0;
		font-size: 1.4em;
	}

	path.avg {
		stroke: currentColor;
		opacity: 0.5;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 1px;
		fill: none;
	}

	path.scatter {
		stroke-width: 3px;
	}

	path.trend {
		stroke: #ff3e00;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2px;
		fill: none;
	}

	.focus {
		position: absolute;
		width: 10px;
		height: 10px;
		left: -5px;
		top: -5px;
		border: 1px solid black;
		border-radius: 50%;
		box-sizing: border-box;
	}

	.tooltip {
		position: absolute;
		white-space: nowrap;
		width: 8em;
		bottom: 1em;
		/* background-color: white; */
		line-height: 1;
		text-shadow: 0 0 10px white, 0 0 10px white, 0 0 10px white, 0 0 10px white, 0 0 10px white, 0 0 10px white, 0 0 10px white;
	}

	.tooltip strong {
		font-size: 1.4em;
		display: block;
	}

	@media (min-width: 800px) {
		.chart {
			height: 600px;
		}
	}
</style>