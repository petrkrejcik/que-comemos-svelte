import { getAuth } from "firebase/auth";
import { authState } from "rxfire/auth";
import {writable} from "svelte/store"; 

export let user = writable();

const auth = getAuth();
authState(auth).subscribe(u => {
  user.set(u)
});

