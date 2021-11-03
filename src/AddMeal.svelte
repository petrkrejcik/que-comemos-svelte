<script>
  import { writable } from "svelte/store";
  import { collection, addDoc } from "firebase/firestore";
  import { db } from "./firebase";

  export let onSave;

  const meal = writable({
    name: "",
    category: "",
    eatFor: "",
    forChild: true,
  });

  const onSubmit = () => {
    addDoc(collection(db, "meals"), $meal);
    onSave();
  };
</script>

<form on:submit|preventDefault={onSubmit} style="display: flex; flex-direction: column">
  Nombre
  <input type="text" bind:value={$meal.name} />

  Categoría
  <select bind:value={$meal.category}>
    <option value="meat">Carne</option>
    <option value="fish">Pescado</option>
    <option value="beans">Legumbres</option>
    <option value="vegetable">Verdura</option>
    <option value="pasta">Pasta</option>
    <option value="bread">Pan</option>
  </select>

  Cuando
  <select bind:value={$meal.eatFor}>
    <option value="lunch">Comida</option>
    <option value="dinner">Cena</option>
  </select>

  <div style="display: flex">
    <input type="checkbox" bind:checked={$meal.forChild} id="forChild" /><label for="forChild">También para niños</label
    >
  </div>

  <button type="submit" style="margin-top: 8px">Guardar</button>
</form>
