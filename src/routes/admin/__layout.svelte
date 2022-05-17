<div class="layout">
  <nav class="sidebar">
    <h1>Admin Controls</h1>
  </nav>
  <main class="content">
    <slot/>
  </main>
</div>


<style>
  .layout {
    display: grid;
    grid-template-areas: "sidebar content";
    grid-template-columns: 250px auto;
    min-height: calc(100vh - 16px);
  }

  .sidebar {
    grid-area: sidebar;
    border-right: 1px solid currentColor;
    padding-left: 1ex;
  }

  .content {
    grid-area: content;
    padding-left: 1ex;
  }

  .sidebar h1 {
    font-size: 1.5em;
    font-weight: lighter;
  }

  @media (max-width: 600px) {
    .layout {
      grid-template-areas: "sidebar" "content";
      grid-template-columns: auto;
    }
  }



</style>