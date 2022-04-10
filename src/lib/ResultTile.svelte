<script>
  import Carousel from '$lib/TinyMediaCarousel.svelte'
  import RegionMap from '$lib/RegionMap.svelte'
  import Icon from '$lib/Icon.svelte'

  export let data = undefined
  export let expand = false
  export let permalink = undefined

  $: warnings = data ? [...getWarnings(data.tags)] : []

  function * getWarnings (tags) {
    if (tags.includes('invented'))
      yield { text: 'Informal, colloqual sign. Professionals should not use.' }
  }
</script>


<div class={$$props.class} class:result={true} class:placeholder={!data} class:expand={expand}>
  {#if data}
    <Carousel medias={data.media} link={data.link} class=carousel></Carousel>

    <div class=heading>
      <div class=datas>
        <h2 class=words><a href={data.link} referrerpolicy=origin rel=external>{data.title || data.keywords.join(', ')}</a></h2>

        <cite class=link>
          {#if data.nav && data.nav.length > 0}
            {#each data.nav as [name, url]}
              <a href={url} referrerpolicy=origin rel=external>{name}</a>
            {/each}
          {:else}
            <a href={data.link}>{data.link}</a>
          {/if}
        </cite>

        {#if data.tags && data.tags.length > 0}
          <div class=tags>
            {#each data.tags as tag}{`#${tag} `}{/each}
          </div>
        {/if}
      </div>

      <div class=icons>
        {#if permalink}
          <a class="permalink" href={permalink}><Icon name="link"/></a>
        {/if}

        {#if ['wa','nt','sa','qld','nsw','act','vic','tas'].some(x => data.tags.includes(x))}
          <RegionMap tags={data.tags} class=map></RegionMap>
        {/if}
      </div>
    </div>

    <div class=body>
      {#if warnings.length > 0}
        <div class=alerts>
          {#each warnings as warning}
            <div class="alert {warning.type}">
              <Icon name={warning.icon || 'alert'}/>
              {warning.text}
            </div>
          {/each}
        </div>
      {/if}
      {data.body || ''}
    </div>
  {/if}
</div>

<style>
  .result {
    background-color: var(--module-bg);
    border-radius: 10px;
    margin-top: 1.1em;
    color: inherit;
    text-decoration: none;
    overflow: hidden;
    padding: 1ex;

    /* very fancy soon to be out of style custom 'neumorphic' style box */
    box-shadow:
    /* inset highlight and shadow */
    inset 0 -7rem 5em -2em hsla(var(--hue), calc(var(--module-bg-sat) - 5%), calc(var(--module-bg-lum) + 5%), var(--outer-highlight-alpha)),
    inset 0 +7rem 5em -2em hsla(var(--hue), calc(var(--module-bg-sat) + 5%), calc(var(--module-bg-lum) - 3%), var(--outer-shadow-alpha)),
    /* outside drop shadow */
    0.3rem 0.3rem 0.4rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 10%), var(--outer-shadow-alpha)),
    0.2rem 0.3rem 0.2rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 8%), var(--outer-shadow-alpha)),
    0.1rem 0.1rem 0.1rem hsla(var(--hue), calc(var(--base-bg-sat) + 5%), calc(var(--base-bg-lum) - 6%), var(--outer-shadow-alpha)),
    /* outside top highlight */
    -0.3rem -0.3rem 0.4rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 6%), var(--outer-highlight-alpha)),
    -0.2rem -0.2rem 0.2rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 4%), var(--outer-highlight-alpha)),
    -0.1rem -0.1rem 0.1rem hsla(var(--hue), calc(var(--base-bg-sat) - 5%), calc(var(--base-bg-lum) + 2%), var(--outer-highlight-alpha))
    ;
  }

  .words {
    line-height: 1em;
    margin: 0;
    grid-area: title;
    font-size: 1.3rem;
    font-weight: normal;
    text-transform: capitalize;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .words a {
    text-decoration: none;
    color: inherit;
  }

  .result :global(.map) {
    width: 2em;
    height: 2em;
    stroke-width: 5px;
  }

  .heading {
    grid-area: heading;
    display: grid;
    grid-template-columns: auto max-content;
    grid-template-areas: "datas icons";
  }

  .heading > .datas { grid-area: datas; overflow: hidden; }
  .heading > .datas * { text-overflow: ellipsis; }
  .heading > .icons {
    grid-area: icons;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 2em;
    grid-template-rows: 2em;
    place-items: center;
  }
  /* .heading > .icons > * { width: 2em; height: 2em; } */
  .heading .permalink { text-align: center; opacity: 0.5 }
  .heading .permalink:hover { opacity: 1.0 }

  .link { grid-area: breadcrumbs; }
  .tags { grid-area: hashtags; }
  .alerts { grid-area: alerts; }
  .body { grid-area: body; }

  .result:not(.expand) {
    display: grid;
    grid-template-columns: 250px 1ex auto;
    grid-template-rows: 2.5rem auto;
    min-height: 158px;
    grid-template-areas:
      "media gap heading"
      "media gap body";
  }

  .result.expand {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto 1ex auto auto;
    grid-template-areas:
      "media"
      "gap"
      "heading"
      "body";
  }

  .result :global(.carousel) {
    grid-area: media;
  }

  .link, .tags {
    text-overflow: ellipsis;
    font-size: 80%;
    white-space: nowrap;
    overflow: hidden;
  }

  .link a {
    text-decoration: underline;
    font-style: normal;
    color: inherit;
  }

  /* add forward slashes to nav breadcrumb type links */
  .link a:not(:first-child):before {
    content: "/";
    padding-left: 0.7ex;
    padding-right: 0.7ex;
    display: inline-block; /* removes underline */
  }

  .body {
    --line-height: 1.4em;
    --visible-lines: 4.65;
    text-overflow: ellipsis;
    white-space: pre-line;
    overflow: hidden;
    line-height: var(--line-height);
    font-size: 0.95em;
    max-height: calc(var(--line-height) * var(--visible-lines) - 1rem);
  }

  .result.expand .body {
    max-height: unset;
  }

  /* alert notices on search results */
  .result.invented { background-color: var(--alert-bg); }
  .result .alert :global(svg) {
    vertical-align: -0.2ex;
  }

  @media (max-width: 600px) {
    div.result:not(.expand) {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: auto 1ex auto auto;
      grid-template-areas:
        "media"
        "gap"
        "heading"
        "body";
    }

    div.result:not(.expand) .body {
      max-height: unset;
    }
  }
</style>