<script>
  import { collection, query, doc, updateDoc, orderBy } from "firebase/firestore";
  import { db } from "./firebase";
  import { getWeekId } from "./date";
  import { collectionData, docData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";
  import { writable } from "svelte/store";

  const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  let weekPlan = {};
  let mealsQueryEnabled = false;
  const mealsRef = collection(db, "meals");
  const weekPlanRef = doc(db, "weekPlans", getWeekId());

  const mealsQuery = query(mealsRef, orderBy("name"));
  const weekPlanQuery = query(weekPlanRef);

  let meals = writable([]);
  $: if (mealsQueryEnabled) {
    meals = collectionData(mealsQuery, { idField: "id" }).pipe(startWith([]));
  }
  docData(weekPlanQuery).subscribe({
    next: (result) => {
      if (result) {
        weekPlan = result;
      }
    },
    error: (error) => {
      console.log("🛎 ", "error", error);
    },
  });

  const onChange = (dayIndex) => (e) => {
    const meal = $meals.find((meal) => meal.id === e.target.value);
    if (!meal) return;
    updateDoc(weekPlanRef, {
      [`d${dayIndex}.lunch`]: {
        id: meal.id,
        name: meal.name,
      },
    });
  };

  const onSelectClick = (e) => {
    mealsQueryEnabled = true;
  };
</script>

{#each days as day, i}
  <div style="display: flex; flex-direction: column">
    {day}
    <select on:change={onChange(i)} on:click={onSelectClick}>
      {#if !mealsQueryEnabled && weekPlan[`d${i}`]?.lunch}
        <option selected value on:click={onSelectClick}>{weekPlan[`d${i}`].lunch.name}</option>
      {/if}
      {#each $meals as meal}
        {#if !weekPlan[`d${i}`]?.lunch}
          <option disabled selected value style="display:none" />
        {/if}
        <option value={meal.id} selected={weekPlan[`d${i}`]?.lunch?.id === meal.id}>{meal.name}</option>
      {/each}
    </select>
  </div>
{/each}
