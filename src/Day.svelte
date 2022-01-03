<script>
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "./firebase";
  import { url } from "./lib/routerStore";
  import { getMeals, getWeekPlan } from "./lib/firestoreCache";

  let weekPlan = {};
  const [, weekId, dayIndex] = $url.split("/");
  const weekPlanRef = doc(db, "weekPlans", weekId);

  const meals = getMeals();
  getWeekPlan(weekId).subscribe({
    next: (result = []) => {
      weekPlan = result;
    },
    error: (error) => {
      console.log("🛎 ", "error", error);
    },
  });

  const onChange = (e) => {
    const meal = $meals.find((meal) => meal.id === e.target.value);
    if (!meal) return;
    setDoc(
      weekPlanRef,
      {
        [dayIndex]: {
          lunch: {
            id: meal.id,
            name: meal.name,
          },
        },
      },
      { merge: true }
    );
  };
</script>

<div style="display: flex; align-items: flex-start;">
  <button on:click={() => ($url = "meals")}>&lt;</button>
</div>

<div style="display: flex; justify-content: space-between">
  <select on:change={onChange} style="flex-grow: 1; width: 100%; height: 300px" size="100">
    {#each $meals as meal}
      {#if !weekPlan[dayIndex]?.lunch}
        <option disabled selected value style="display:none" />
      {/if}
      <option value={meal.id} selected={weekPlan[dayIndex]?.lunch?.id === meal.id}>{meal.name}</option>
    {/each}
  </select>
</div>
