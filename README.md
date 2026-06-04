# MealTracker — COM6031M Component 2
**Pablo Rodríguez García · 250157396**

A React Native (Expo) mobile application for tracking restaurant meals in York.  
Persistence: `AsyncStorage` (device-local key-value store, equivalent to localStorage).

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native · **Expo SDK 51** |
| Routing | **Expo Router** (file-based) |
| Persistence | **AsyncStorage** (`@react-native-async-storage/async-storage`) |
| Language | TypeScript |
| Password hashing | `expo-crypto` SHA-256 |
| Testing | Jest · `jest-expo` preset |

---

## Features (Specifications 01–07)

| # | Feature | Screen |
|---|---------|--------|
| 01 | User registration (email, username, password) | `app/signin.tsx` |
| 02 | User login / logout with persistent session | `app/login.tsx` |
| 03 | Browse York restaurants with search + pagination | `app/(tabs)/index.tsx` |
| 04 | Restaurant detail: photo, description, menu, last meals | `app/restaurant/[id].tsx` |
| 05 | Record a meal: select dishes, enter Flavor/Price scores | `app/add-meal/[id].tsx` |
| 06 | View all recorded meals with average score | `app/(tabs)/meals.tsx` |
| 07 | View a specific meal's full item breakdown | `app/meal/[id].tsx` |

---

## How to Run

### Prerequisites
- Node.js ≥ 18
- Expo Go app on your phone (Android or iOS)

### Steps
```bash
cd MealTrackerRN
npm install
npx expo start
```
Scan the QR code with Expo Go.  
Or press `a` for Android emulator / `i` for iOS simulator.

---

## How to Run Tests

```bash
npm test
```

Results show all test suites. Each test case maps to one of the 12 test cases from the Test Plan.

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
│   │   ├── index.tsx            # TC4 — Restaurants list + search + pagination
│   │   └── meals.tsx            # TC10 — Meal list
│   ├── restaurant/[id].tsx      # TC5 — Restaurant detail
│   ├── add-meal/[id].tsx        # TC6, TC7, TC8, TC9 — Add/confirm meal
│   └── meal/[id].tsx            # TC11 — Meal detail
├── src/
│   ├── types/index.ts           # TypeScript types (User, Restaurant, Meal, MealItem)
│   ├── theme.ts                 # Colours, font sizes, spacing constants
│   └── utils/
│       ├── seedData.ts          # 5 York restaurants (static data)
│       ├── passwordUtils.ts     # SHA-256 hashing via expo-crypto
│       ├── storage.ts           # AsyncStorage CRUD + calculateAverageScore
│       └── validation.ts        # Pure validation functions (email, username, password, score)
└── __tests__/
    ├── validation.test.ts       # TC1, TC2, TC3, TC7 — Input validation
    ├── mealCalculations.test.ts # TC6, TC7, TC8 — Scoring logic
    ├── storage.test.ts          # TC4, TC10, TC11, TC12 — Storage operations
    └── passwordUtils.test.ts   # TC1, TC2, TC3 — Hash consistency
```

---

## Test Plan Alignment

| TC | Description | Test File | Test Name |
|----|-------------|-----------|-----------|
| TC1 | User Registration — valid inputs | `validation.test.ts` | `validateRegisterForm – all valid` |
| TC1 | Registration — blank email | `validation.test.ts` | `validateEmail – empty` |
| TC1 | Registration — invalid email | `validation.test.ts` | `validateEmail – invalid format` |
| TC1 | Registration — password < 6 chars | `validation.test.ts` | `validatePassword – too short` |
| TC1 | Password hashed before storage | `passwordUtils.test.ts` | `returns 64-char hex string` |
| TC2 | Login — valid credentials match | `passwordUtils.test.ts` | `same password same hash` |
| TC3 | Login — wrong password ≠ hash | `passwordUtils.test.ts` | `different passwords different hashes` |
| TC3 | Login — empty fields | `validation.test.ts` | `validateLoginForm – empty` |
| TC4 | Restaurant data loads correctly | `storage.test.ts` | `getMealsByRestaurant – max 5` |
| TC6 | Select menu items filters correctly | `mealCalculations.test.ts` | `only checked dishes included` |
| TC7 | Ratings stored correctly | `mealCalculations.test.ts` | `valid flavor/price scores` |
| TC7 | Score out of range rejected | `validation.test.ts` | `validateScore – > 5 / negative` |
| TC8 | Confirm saves meal | `mealCalculations.test.ts` | `calculateAverageScore – multiple` |
| TC9 | Cancel keeps state (no save) | `mealCalculations.test.ts` | `empty items returns 0` |
| TC10 | View meal list (user filtered) | `storage.test.ts` | `getMealsByUser – filters user` |
| TC10 | Meals sorted by date desc | `storage.test.ts` | `getMealsByUser – sorted` |
| TC11 | Open meal detail by ID | `storage.test.ts` | `getMealById – correct meal` |
| TC11 | Meal not found returns null | `storage.test.ts` | `getMealById – not found` |
| TC12 | Logout clears session | `storage.test.ts` | `clearSession calls removeItem` |

---

## Design Compliance

| Feedback | How addressed |
|----------|---------------|
| Text too small (accessibility) | Minimum 16sp across all screens; titles 26sp |
| High contrast | #FFB800 yellow on #1A1A1A background — WCAG AAA |
| Confirmation dialogs | `Alert.alert` with Cancel + Confirm on Save Meal & Logout |
| Consistent navigation | Expo Router Stack + Bottom Tabs; back arrows on all detail screens |
| Norman's Feedback | Success/error alerts on every action |
| Shneiderman's Reversal | Cancel button on Add Meal; Cancel on logout dialog |

---

## Security

- Passwords hashed with **SHA-256** before storage — never stored in plain text
- Session stored as a userId string in AsyncStorage (no sensitive data in session)
- Input validation runs **before** any storage operation
