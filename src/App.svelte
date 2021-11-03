<script>
  import Profile from "./Profile.svelte";
  import { auth, authProvider } from "./firebase";
  import { getAuth, signInWithPopup } from "firebase/auth";
  import { authState } from "rxfire/auth";
  import Meals from "./Meals.svelte";
  import AddMeal from "./AddMeal.svelte";

  let user;
  let section = "meals";

  function login() {
    const auth = getAuth();
    signInWithPopup(auth, authProvider)
      .then((result) => {
        user = result.user;
      })
      .catch((error) => {});
  }

  const unsubscribe = authState(auth).subscribe((u) => (user = u));
</script>

<section>
  {#if user}
    {#if section === "meals"}
      <Meals />
      <button on:click={() => (section = "add")}>Add</button>
    {:else if section === "add"}
      <AddMeal onSave={() => (section = "meals")} />
    {/if}
  {:else}
    <button on:click={login}> Signin with Google </button>
  {/if}
</section>
