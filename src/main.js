import App from "component/App.svelte";
import { init } from "lib/firebase/firebase";
import { User } from "lib/user/User";
import "./tailwind.css";

let user = null;
const firebase = init();
firebase.auth.observe((userData) => {
  console.log("🛎 ", "jo", userData);
  if (userData) {
    user = User(userData);
    console.log("🛎 ", "user", user);
  }
});
const app = new App({
  target: document.body,
  props: {
    name: "world",
    firebase,
    user,
  },
});

export default app;
