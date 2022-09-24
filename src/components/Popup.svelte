<script lang="ts">
  import Organizer from "./Organizer.svelte";
  import Auth from "./Auth.svelte";
  import { webData, colorMode } from "../scripts/stores";

  (async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await browser.tabs.query(queryOptions);
    const tabInfo = {
      id: { text: "Id", value: tab.id },
      textValues: {
        none: { text: "None", value: "none", icon: "none" },
        title: { text: "Page Title", value: tab.title, icon: "title" },
        url: { text: "Page URL", value: tab.url, icon: "url" },
        favicon: {
          text: "Icon URL",
          value: tab.favIconUrl,
          icon: "image",
        },
      },
    };
    webData.set(tabInfo);
  })();

let userLoggedIn = false;

</script>

<div class={`container ${$colorMode}`}>
	{#if userLoggedIn}
	<Auth />
	{:else}
  <Organizer />
  {/if}
</div>

<style global lang="scss">
  @use "../style/global" as *;

  @keyframes widen {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .container {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    height: auto;
    pointer-events: all;
    overflow: hidden;
    animation: widen 600ms ease-in-out forwards;
    transform-origin: top center;
    transition: 200ms ease-in-out;
  }
</style>
