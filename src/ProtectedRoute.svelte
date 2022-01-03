<script>
  import { Route, navigate } from "svelte-routing";
  import { user } from "./lib/user";

  export let path;
  export let component;

  $: if ($user === null) {
    navigate("/login", { replace: true });
  }
</script>

{#if !!$user}
  <Route {path} {component} />
{/if}
