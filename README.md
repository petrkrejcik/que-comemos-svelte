# Que comemos

## Features
- See food plan
  - Per week
  - Button for random food
- Database of food
  - Lunch
  - Dinner

## Firestore
```json
{
  "/meals": {
    "[id]": {
      "name": "string",
      "eatFor": "lunch"|"dinner",
      "category": "fish"|"meat",
      "lastEaten": "datetime"
    }
  },
  "/weekPlans": {
    "[startDate]": {
      "d0": {
        "lunch": "abc123",
        "dinner": "abc123",
        "childLunch": "abc123",
      }
    }
  }
}
```

## Database of products

openfoodfacts.org

### API

https://world.openfoodfacts.org/api/v0/product/8435065300277.json
