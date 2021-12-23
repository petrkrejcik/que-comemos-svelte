<script>
  import { collection, query, doc, updateDoc, setDoc, orderBy } from "firebase/firestore";
  import { db } from "./firebase";
  import { randomizeDay, randomizeWeek } from "./lib/meal";
  import { getWeekId } from "./date";
  import { collectionData, docData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";
  import { writable } from "svelte/store";

  const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  let weekPlan = {};
  let mealsQueryEnabled = false;
  const mealsRef = collection(db, "meals");
  let week = 0;
  let weekId = getWeekId(week);
  let weekPlanRef = doc(db, "weekPlans", weekId);
  let weekPlanQuery = query(weekPlanRef);
  $: weekId = getWeekId(week);
  $: weekPlanRef = doc(db, "weekPlans", weekId);

  const mealsQuery = query(mealsRef, orderBy("name"));
  $: weekPlanQuery = query(weekPlanRef);

  let meals = writable([]);
  $: if (mealsQueryEnabled) {
    meals = collectionData(mealsQuery, { idField: "id" }).pipe(startWith([]));
  }
  $: docData(weekPlanQuery).subscribe({
    next: (result = []) => {
      weekPlan = result;
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

  const onPrevClick = () => {
    week--;
  };

  const onNextClick = () => {
    week++;
  };

  const onRandomizeClick = () => {
    if (!mealsQueryEnabled) {
      return; // TODO: fetch meals first
    }
    const newWeek = randomizeWeek($meals);
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

  const onRandomizeDayClick = (dayIndex) => () => {
    if (!mealsQueryEnabled) {
      return; // TODO: fetch meals first
    }
    const meal = randomizeDay($meals);
    setDoc(
      weekPlanRef,
      {
        [`d${dayIndex}`]: {
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

<div style="display: flex; justify-content: center; align-items: center;">
  <button on:click={onPrevClick}>&lt;</button>
  {weekId}
  <button on:click={onNextClick}>&gt;</button>
</div>

{#each days as day, i}
  <div style="display: flex; flex-direction: column">
    {day}
    <div style="display: flex; justify-content: center; align-items: center; gap: 8px">
      <select on:change={onChange(i)} on:click={onSelectClick} style="flex-grow: 1; width: 100%">
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
      <button on:click={onRandomizeDayClick(i)}>🔄</button>
    </div>
  </div>
{/each}

<button on:click={onRandomizeClick}>🔄 Random</button>
