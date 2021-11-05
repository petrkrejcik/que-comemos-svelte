export const randomizeWeek = (meals) => { 
  return [...Array(7)].map(() => randomizeDay(meals)) 
}

export const randomizeDay = (meals) => {
  const randomIndex = Math.floor(Math.random() * meals.length) 
  return meals[randomIndex] 
}