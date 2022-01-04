<script>
  import { navigate } from "svelte-routing";
  import { doc, setDoc } from "firebase/firestore";
  import { db } from "./firebase";
  import { getMeals, getWeekPlan } from "./lib/firestoreCache";
  import AppBar from "./AppBar.svelte";
  import { Button, List } from "smelte";
  import Content from "./Content.svelte";
  import { getIcon } from "./lib/meal";

  export let weekId;
  export let dayIndex;

  let weekPlan = {};
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
    const meal = $meals.find((meal) => meal.id === e.detail);
    if (!meal) return;
    setDoc(
      weekPlanRef,
      {
        [dayIndex]: {
          lunch: {
            id: meal.id,
            name: meal.name,
            icon: getIcon(meal.category),
          },
        },
      },
      { merge: true }
    );
    history.back();
  };
</script>

<AppBar class="flex justify-between">
  <Button on:click={() => navigate("/")} icon="arrow_back" text />
  <Button on:click={() => navigate("/add")} icon="add" text />
</AppBar>

<Content>
  <List
    value={weekPlan[dayIndex]?.lunch?.id || null}
    items={$meals.map((meal) => ({
      text: [getIcon(meal.category), meal.name].filter(Boolean).join(" "),
      value: meal.id,
    }))}
    on:change={onChange}
    class="w-full"
  />
</Content>
