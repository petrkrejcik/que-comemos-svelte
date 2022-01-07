import { query, where, orderBy, collection, doc } from "firebase/firestore";
import { collectionData, docData } from "rxfire/firestore";
import { startWith } from "rxjs";
import {writable} from "svelte/store"; 
import { db } from "../firebase";

const cache = writable({});

export const getMeals = (filter = {}) => {
  if (cache.meals) {
    return cache.meals
  }
  const mealsRef = collection(db, "meals");
  const mealsQuery = query(mealsRef, where("eatFor", "==", filter.eatFor || "lunch"), where("forChild", "==", true), orderBy("name"));
  const meals = collectionData(mealsQuery, { idField: "id" }).pipe(startWith([]));
  return cache.meals = meals
}

export const getWeekPlan = (weekId) => {
  const key = `weekPlan${weekId}`
  if (cache[key]) {
    return cache[key]
  }
  let q = query(doc(db, "weekPlans", weekId));
  return cache[key] = docData(q)
}
