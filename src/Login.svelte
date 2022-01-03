<script>
  import { navigate } from "svelte-routing";
  import { getAuth, signInWithPopup } from "firebase/auth";
  import { auth, authProvider } from "./firebase";
  import { user } from "./lib/user";

  const login = () => {
    const auth = getAuth();
    signInWithPopup(auth, authProvider).catch((error) => {
      console.log("🛎 ", "error during login", error);
    });
  };

  $: if ($user) {
    navigate("/", { replace: true });
  }
</script>

<button on:click={login}>Sign In with Google </button>
