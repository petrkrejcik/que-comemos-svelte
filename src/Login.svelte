<script>
  import { navigate } from "svelte-routing";
  import { signInWithPopup } from "firebase/auth";
  import { auth, authProvider } from "./firebase";
  import { user } from "./lib/user";
  import { Button } from "smelte";

  const login = () => {
    signInWithPopup(auth, authProvider).catch((error) => {
      console.log("🛎 ", "error during login", error);
    });
  };

  $: if ($user) {
    navigate("/", { replace: true });
  }
</script>

<div class="h-full w-full flex justify-center items-center"><Button on:click={login}>Sign In with Google</Button></div>
