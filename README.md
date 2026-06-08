# MealTracker — COM6031M Component 2
**Pablo Rodríguez García · 250157396**

A React Native (Expo) mobile application for tracking restaurant meals in York.  
Persistence: `AsyncStorage` (device-local key-value store).

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native · **Expo SDK 54** |
| Routing | **Expo Router v6** (file-based) |
| Persistence | **AsyncStorage** (`@react-native-async-storage/async-storage`) |
| Language | TypeScript |
| Testing | Jest · `jest-expo` preset |

---

## Features (Specifications 01–07)

| # | Feature | Screen |
|---|---------|--------|
| 01 | User registration (email, username, password) | `app/signin.tsx` |
| 02 | User login / logout with persistent session | `app/login.tsx` |
| 03 | Browse 10 York restaurants with search + pagination | `app/(tabs)/index.tsx` |
| 04 | Restaurant detail: photo, description, menu, last meals from all users | `app/restaurant/[id].tsx` |
| 05 | Record a meal: select dishes, enter Flavor/Price scores (0–5) | `app/add-meal/[id].tsx` |
| 06 | View my recorded meals with average score | `app/(tabs)/meals.tsx` |
| 07 | View a specific meal's full item breakdown | `app/meal/[id].tsx` |

---

## How to Run

### Prerequisites
- Node.js ≥ 18
- Expo Go app on your phone (Android or iOS)

### Steps
```bash
npm install
npx expo start
```
Scan the QR code with Expo Go on your phone.

---

## How to Run Automated Tests

```bash
npm test
```

Runs all 3 test suites (21 tests total). Each test maps to a test case from the Component 1 Test Plan.

---

## Test Plan Alignment

| TC | Description | Test File | Test Name |
|----|-------------|-----------|-----------|
| TC1 | Valid registration form accepted | `validation.test.ts` | `valid form returns no error` |
| TC1 | Invalid email rejected | `validation.test.ts` | `invalid email is rejected` |
| TC1 | Short password rejected | `validation.test.ts` | `short password is rejected` |
| TC1 | Empty username rejected | `validation.test.ts` | `empty username is rejected` |
| TC3 | Valid login form accepted | `validation.test.ts` | `valid form returns no error` |
| TC3 | Empty username rejected on login | `validation.test.ts` | `empty username returns an error` |
| TC3 | Empty password rejected on login | `validation.test.ts` | `empty password returns an error` |
| TC4 | New user saved to storage | `storage.test.ts` | `addUser saves the new user` |
| TC4 | Find user by username | `storage.test.ts` | `findUserByUsername returns the correct user` |
| TC4 | Unknown email returns null | `storage.test.ts` | `findUserByEmail returns null for unknown email` |
| TC6 | Only checked dishes included | `mealCalculations.test.ts` | `only checked dishes are included` |
| TC6 | Unchecked dishes excluded | `mealCalculations.test.ts` | `unchecked dishes are excluded` |
| TC7 | Single dish average score correct | `mealCalculations.test.ts` | `single dish returns correct average` |
| TC7 | Multiple dishes average score correct | `mealCalculations.test.ts` | `multiple dishes returns correct overall average` |
| TC7 | Empty dish list returns 0 | `mealCalculations.test.ts` | `empty list returns 0` |
| TC10 | Meal saved to storage | `storage.test.ts` | `addMeal saves the meal` |
| TC11 | Meal list filtered by user | `storage.test.ts` | `getMealsByUser returns only the logged-in user meals` |
| TC11 | Empty meal list returns empty array | `storage.test.ts` | `getMealsByUser returns empty when no meals exist` |
| TC12 | Session stored after login | `storage.test.ts` | `setCurrentUserId stores the id` |
| TC12 | Logout removes session | `storage.test.ts` | `clearSession removes the session key` |
| TC12 | No session returns null | `storage.test.ts` | `getCurrentUserId returns null when not logged in` |

---

## Project Structure

```
MealTrackerRN/
├── app/
│   ├── _layout.tsx              # Root Stack navigator
│   ├── index.tsx                # Auth check + redirect
│   ├── login.tsx                # TC2, TC3 — Login screen
│   ├── signin.tsx               # TC1 — Registration screen
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Bottom tab bar (Restaurants | My Meals)
│   │   ├── index.tsx            # TC3, TC4 — Restaurants list + search + pagination
│   │   └── meals.tsx            # TC10, TC11 — My meals list
│   ├── restaurant/[id].tsx      # TC4 — Restaurant detail + all users' meals
│   ├── add-meal/[id].tsx        # TC5, TC6, TC7, TC8 — Add meal
│   └── meal/[id].tsx            # TC11 — Meal detail
├── src/
│   ├── components/
│   │   └── AppModal.tsx         # Reusable themed modal (replaces Alert)
│   ├── types/index.ts           # TypeScript interfaces (User, Restaurant, Meal, MealItem)
│   ├── theme.ts                 # Colours, font sizes, spacing
│   └── utils/
│       ├── seedData.ts          # 10 York restaurants (static seed data)
│       ├── storage.ts           # AsyncStorage CRUD + calculateAverageScore
│       └── validation.ts        # Form validation (email, username, password, score)
└── __tests__/
    ├── validation.test.ts       # TC1, TC3 — Input validation (7 tests)
    ├── mealCalculations.test.ts # TC6, TC7 — Scoring logic (5 tests)
    └── storage.test.ts          # TC4, TC10, TC11, TC12 — Storage operations (9 tests)
```

---

## Design Compliance

| Feedback from Component 1 | How addressed |
|--------------------------|---------------|
| Text too small (accessibility) | Minimum 16sp across all screens; titles 26sp |
| High contrast | #FFB800 yellow on #1A1A1A dark background |
| Confirmation dialogs | Custom themed modal (AppModal) on Save Meal and Logout |
| Consistent navigation | Expo Router Stack + Bottom Tabs; back arrows on all detail screens |
| Norman's Feedback principle | Success/error modals on every user action |
| Shneiderman's Reversal | Cancel button on Add Meal and logout dialog |
| Android system navigation | Safe area insets applied to tab bar (no overlap with system buttons) |

---

## Restaurants Included

| # | Name | Location |
|---|------|----------|
| 1 | Bill's | 12 Coney Street |
| 2 | YUZU | Enterprise Complex |
| 3 | Cosy Club | 19-22 Fossgate |
| 4 | Prezzo Italian | 1 Clifford Street |
| 5 | Byron | 11 High Ousegate |
| 6 | L'Osteria Italiana | 31 Castlegate |
| 7 | Il Paradiso Del Cibo | 40 Walmgate |
| 8 | Ambiente Tapas | 31 Fossgate |
| 9 | Burgsy's | 9 Walmgate |
| 10 | Rustique | 28 Castlegate |
