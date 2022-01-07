<script>
  import { navigate } from "svelte-routing";
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "./firebase";
  import { randomizeWeek } from "./lib/meal";
  import { getWeekId } from "./date";
  import { getMeals, getWeekPlan } from "./lib/firestoreCache";
  import { Button, List, Tabs } from "smelte";
  import AppBar from "./AppBar.svelte";
  import Content from "./Content.svelte";
  import dayjs from "dayjs";

  // const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  let weekPlan = {};
  let week = 0;
  let days = [];
  let weekId = getWeekId(week);
  let weekPlanRef = doc(db, "weekPlans", weekId);
  let eatForTab = "lunch";
  $: weekId = getWeekId(week);
  $: weekPlanRef = doc(db, "weekPlans", weekId);
  $: days = [
    { text: "Lunes", onClick: () => navigate(`/day/${weekId}/d0/${eatForTab}`), food: weekPlan.d0?.[eatForTab] },
    { text: "Martes", onClick: () => navigate(`/day/${weekId}/d1/${eatForTab}`), food: weekPlan.d1?.[eatForTab] },
    { text: "Miércoles", onClick: () => navigate(`/day/${weekId}/d2/${eatForTab}`), food: weekPlan.d2?.[eatForTab] },
    { text: "Jueves", onClick: () => navigate(`/day/${weekId}/d3/${eatForTab}`), food: weekPlan.d3?.[eatForTab] },
    { text: "Viernes", onClick: () => navigate(`/day/${weekId}/d4/${eatForTab}`), food: weekPlan.d4?.[eatForTab] },
    { text: "Sábado", onClick: () => navigate(`/day/${weekId}/d5/${eatForTab}`), food: weekPlan.d5?.[eatForTab] },
    { text: "Domingo", onClick: () => navigate(`/day/${weekId}/d6/${eatForTab}`), food: weekPlan.d6?.[eatForTab] },
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
            [eatForTab]: {
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

<Tabs
  bind:selected={eatForTab}
  class="w-100 bg-primary-200"
  color="white"
  items={[
    { id: "lunch", text: "Comida" },
    { id: "dinner", text: "Cena" },
  ]}
/>
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
