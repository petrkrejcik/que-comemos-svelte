<script>
  import "smelte/src/tailwind.css";
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
  <div class="h-full w-full flex justify-center items-center">Cargando...</div>
{:else}
  <Router {url}>
    <section>
      <Route path="/login" component={Login} />
      <ProtectedRoute path="/day/:weekId/:dayIndex" component={Day} />
      <ProtectedRoute path="/add" component={AddMeal} />
      <ProtectedRoute path="/" component={Meals} />
    </section>
  </Router>
{/if}
