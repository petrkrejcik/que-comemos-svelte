<script>
  import { Button, Icon } from "smelte";
  import { AppBar } from "smelte";

  export let name;
  export let firebase;
</script>

<main>
  <AppBar>
    <Button text light>Button</Button>
  </AppBar>
  <h1>xHello {name}!</h1>

  <div class="py-2">
    <Button
      dark
      on:click={() => {
        console.log('click');
        firebase.auth.loginByPopup();
      }}>
      Login
    </Button>
  </div>
</main>
