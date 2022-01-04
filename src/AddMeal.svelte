<script>
  import { writable } from "svelte/store";
  import { collection, addDoc } from "firebase/firestore";
  import { db } from "./firebase";
  import { Button, TextField, Select, Checkbox } from "smelte";
  import AppBar from "./AppBar.svelte";
  import Content from "./Content.svelte";
  import { CATEGORIES } from "./lib/meal";

  const meal = writable({
    name: "",
    category: "",
    eatFor: "",
    forChild: true,
  });

  const onSubmit = () => {
    addDoc(collection(db, "meals"), $meal);
    history.back();
  };

  const eatFor = [
    { value: "lunch", text: "Comida" },
    { value: "dinner", text: "Cena" },
  ];
</script>

<AppBar>
  <Button on:click={() => history.back()} icon="arrow_back" text />
</AppBar>

<Content>
  <form on:submit|preventDefault={onSubmit} class="flex flex-col">
    <TextField label="Nombre" bind:value={$meal.name} />
    <Select
      label="Categoría"
      bind:value={$meal.category}
      selectedLabel={CATEGORIES.find((c) => c.value === $meal.category)?.text}
      items={CATEGORIES}
    />
    <Select
      label="Cuando"
      bind:value={$meal.eatFor}
      selectedLabel={eatFor.find((e) => e.value === $meal.eatFor)?.text}
      items={eatFor}
    />
    <Checkbox label="También para niños" bind:checked={$meal.forChild} />

    <Button type="submit" class="mt-4">Guardar</Button>
  </form>
</Content>
