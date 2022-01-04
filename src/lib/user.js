import { authState } from "rxfire/auth";
import {writable} from "svelte/store";
import { auth } from "../firebase"; 

export let user = writable();

authState(auth).subscribe(u => {
  user.set(u)
});

