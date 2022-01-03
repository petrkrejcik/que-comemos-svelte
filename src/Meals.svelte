<script>
  import { navigate } from "svelte-routing";
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "./firebase";
  import { randomizeWeek } from "./lib/meal";
  import { getWeekId } from "./date";
  import { url } from "./lib/routerStore";
  import { getMeals, getWeekPlan } from "./lib/firestoreCache";

  const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  let weekPlan = {};
  let week = 0;
  let weekId = getWeekId(week);
  let weekPlanRef = doc(db, "weekPlans", weekId);
  $: weekId = getWeekId(week);
  $: weekPlanRef = doc(db, "weekPlans", weekId);

  $: getWeekPlan(weekId).subscribe({
    next: (result = []) => {
      weekPlan = result;
    },
    error: (error) => {
      console.log("🛎 ", "error", error);
    },
  });

  const onPrevClick = () => {
    week--;
  };

  const onNextClick = () => {
    week++;
  };

  const onRandomizeClick = () => {
    const meals = getMeals();
    const newWeek = randomizeWeek(meals);
    setDoc(
      weekPlanRef,
      newWeek.reduce((result, meal, dayIndex) => {
        return {
          ...result,
          [`d${dayIndex}`]: {
            lunch: {
              id: meal.id,
              name: meal.name,
            },
          },
        };
      }, {})
    );
  };
</script>

<div style="display: flex; justify-content: center; align-items: center;">
  <button on:click={onPrevClick}>&lt;</button>
  {weekId}
  <button on:click={onNextClick}>&gt;</button>
</div>

{#each days as day, i}
  <div style="display: flex; justify-content: space-between; align-items: center;">
    {day}:
    <div
      style="display: flex; justify-content: center; flex-grow: 1 ;height: 40px; align-items: center;"
      on:click={() => ($url = `day/${weekId}/d${i}`)}
    >
      {#if weekPlan[`d${i}`]?.lunch}
        {weekPlan[`d${i}`].lunch.name}
      {:else}
        <button style="padding: 3px 30px">Select</button>
      {/if}
    </div>
  </div>
{/each}

<button on:click={() => navigate("/add")}>Add</button>

<!-- <button on:click={onRandomizeClick}>🔄 Random</button> -->
