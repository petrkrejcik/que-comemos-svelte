<script>
  import { writable } from "svelte/store";
  import { collection, addDoc } from "firebase/firestore";
  import { db } from "./firebase";

  const onChange = (e) => {
    const meals = JSON.parse(e.target.value);
    meals.forEach((meal) => {
      addDoc(collection(db, "meals"), meal);
    });
  };
</script>

<input type="text" on:change={onChange} />
<button type="submit" style="margin-top: 8px">Guardar Bulk</button>
