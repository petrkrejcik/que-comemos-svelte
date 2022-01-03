<script>
  import { Router, Link, Route } from "svelte-routing";
  import Meals from "./Meals.svelte";
  import Day from "./Day.svelte";
  import ProtectedRoute from "./ProtectedRoute.svelte";
  import Login from "./Login.svelte";
  import { user } from "./lib/user";
  import AddMeal from "./AddMeal.svelte";

  export let url = "";
</script>

{#if $user === undefined}
  <div style="height: 100%; display: flex; justify-content: center; align-items: center;">Cargando...</div>
{:else}
  <Router {url}>
    <section>
      <ProtectedRoute path="day/:weekId/:dayId" component={Day} />
      <Route path="/add" component={AddMeal} />
      <Route path="/login" component={Login} />
      <ProtectedRoute path="/" component={Meals} />
    </section>
  </Router>
{/if}
