<script>
  import { navigate } from "svelte-routing";
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "./firebase";
  import { randomizeWeek } from "./lib/meal";
  import { getWeekId } from "./date";
  import { url } from "./lib/routerStore";
  import { getMeals, getWeekPlan } from "./lib/firestoreCache";
  import { Button, List } from "smelte";
  import AppBar from "./AppBar.svelte";
  import Content from "./Content.svelte";
  import dayjs from "dayjs";

  // const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  let weekPlan = {};
  let week = 0;
  let days = [];
  let weekId = getWeekId(week);
  let weekPlanRef = doc(db, "weekPlans", weekId);
  $: weekId = getWeekId(week);
  $: weekPlanRef = doc(db, "weekPlans", weekId);
  $: days = [
    { text: "Lunes", onClick: () => navigate(`/day/${weekId}/d0`), food: weekPlan.d0?.lunch },
    { text: "Martes", onClick: () => navigate(`/day/${weekId}/d1`), food: weekPlan.d1?.lunch },
    { text: "Miercoles", onClick: () => navigate(`/day/${weekId}/d2`), food: weekPlan.d2?.lunch },
    { text: "Jueves", onClick: () => navigate(`/day/${weekId}/d3`), food: weekPlan.d3?.lunch },
    { text: "Viernes", onClick: () => navigate(`/day/${weekId}/d4`), food: weekPlan.d4?.lunch },
    { text: "Sábado", onClick: () => navigate(`/day/${weekId}/d5`), food: weekPlan.d5?.lunch },
    { text: "Domingo", onClick: () => navigate(`/day/${weekId}/d6`), food: weekPlan.d6?.lunch },
  ];

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

<AppBar>
  <div class="flex justify-center items-center w-full text-white">
    <Button on:click={onPrevClick} icon="chevron_left" text color="white" />
    {dayjs(weekId).format("DD.MM.")}
    <Button on:click={onNextClick} icon="chevron_right" text color="white" />
  </div>
</AppBar>

<Content>
  <List items={days} dense navigation>
    <li slot="item" let:item>
      <div class="flex justify-center items-center cursor-pointer p-4 h-14" on:click={item.onClick}>
        <div class="w-1/2">
          {item.text}
        </div>
        <div class="w-1/2">
          {#if item.food}
            {item.food.icon || ""}
            {item.food.name}
          {:else}
            <Button outlined>Elegir</Button>
          {/if}
        </div>
      </div>
    </li>
  </List>

  <!-- <button on:click={onRandomizeClick}>🔄 Random</button> -->
</Content>
