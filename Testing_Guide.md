# 🧪 The Ultimate React Native & Expo Testing Guide

Welcome to the comprehensive testing tutorial for your application! This guide is designed to not only walk you through _how_ to write tests for every part of your app, but more importantly, to explicitly explain **why** we do it this way.

By the end of this document, you will be fully prepared for any code review and will be able to speak confidently about testing strategies in a modern React Native/Expo application.

---

## Table of Contents

1. [Core Concepts: Why We Test & How Jest Works](#1-core-concepts-why-we-test--how-jest-works)
2. [What to Test vs. What NOT to Test](#2-what-to-test-vs-what-not-to-test)
3. [Testing Utilities (Pure Functions)](#3-testing-utilities-pure-functions)
4. [Testing APIs and Services (Mocking Axios)](#4-testing-apis-and-services-mocking-axios)
5. [Testing React Hooks](#5-testing-react-hooks)
6. [Testing UI Components (React Native Testing Library)](#6-testing-ui-components-react-native-testing-library)

---

## 1. Core Concepts: Why We Test & How Jest Works

### What is Jest?

Jest is a JavaScript testing framework designed to ensure correctness of any JavaScript codebase. It allows you to write tests with an approachable, familiar and feature-rich API that gives you results quickly. In React Native and Expo projects, Jest is the standard testing tool.

### Why do we write tests?

1. **Confidence in Refactoring:** If you change a piece of code, tests immediately tell you if you broke existing functionality.
2. **Documentation as Code:** Well-written tests explain how a function or component is _supposed_ to behave better than comments do. Reviewers will read your tests to understand what edge-cases you considered.
3. **Fewer Bugs in Production:** Tests catch edge-cases (like what happens if an API returns `undefined` or an empty array) before users ever see them.

### Vocabulary

- **Suite (`describe`):** A block that groups together several related tests. For a file `button.tsx`, you would typically have a `describe('Button Component', ...)` block wrapping everything.
- **Spec (`it` or `test`):** The individual test itself. They both do the same thing, but we usually use `it` so the sentence reads like English: `it('should render correctly')`.
- **Expectation (`expect`):** An assertion about the code. "I _expect_ this button to exist."
- **Matcher (`toBe`, `toEqual`, `toBeTruthy`):** The condition the expectation must meet. `expect(1 + 1).toBe(2)`.
- **Mocking (`jest.fn()`, `jest.mock()`):** Replacing a real piece of code (like a network request to your backend) with a fake one you control. You use mocks because tests need to be **fast** and **predictable**. You don't want a test to fail just because the backend servers are temporarily down.

---

## 2. What to Test vs. What NOT to Test

When preparing for a code review, it's crucial to understand where to invest your testing energy.

**DO Test:**

- **Business Logic:** Does the distance calculation formula work? Do the category filters correctly sort the array?
- **User Interactions:** Does tapping the 'Call' button fire the phone dialer correctly?
- **State Changes:** When the API fails, does the component show an error message instead of crashing?
- **Edge Cases:** What happens if the provider's `latitude` is missing?

**DO NOT Test:**

- **Third-Party Libraries:** Do not test if `expo-router` successfully navigates or if `axios` successfully sends a GET request. The library maintainers already tested that. You only test _your_ code's interaction with them (e.g., "Did my app _call_ `axios.get` with the right URL?").
- **Trivial Code:** Do not test things that just return simple strings without logic, unless it's strictly required by coverage metrics.

---

## 3. Testing Utilities (Pure Functions)

Utilities are the easiest things to test. They are "pure functions"—meaning if you give them a specific input, they always return the same output, with no side effects (like network calls or database writes).

### Example: Testing `getCategoryColor`

Look at your utility file `core/utils/categoryColors.ts`:

```typescript
export function getCategoryColor(categoryName?: string | null): string {
  if (!categoryName) return DEFAULT_CATEGORY_COLOR;
  return CATEGORY_COLORS[categoryName.toLowerCase()] || DEFAULT_CATEGORY_COLOR;
}
```

**What must we test here?**

1. **Happy Path:** Given a known category (e.g., 'crane'), does it return the right color?
2. **Case Insensitivity:** Given 'cRaNe', does it still work?
3. **Unknown Category:** Given a random word like 'astronaut', does it return the `DEFAULT_CATEGORY_COLOR`?
4. **Empty/Null inputs:** What happens if we pass `undefined` or `null`?

**The Test File (`__tests__/categoryColors.test.ts`)**

```typescript
import {
  getCategoryColor,
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR
} from '../categoryColors';

describe('getCategoryColor Utility', () => {
  it('returns the correct color for a valid category', () => {
    // We expect 'cleaner' to return whatever hex is in the map.
    expect(getCategoryColor('cleaner')).toBe(CATEGORY_COLORS.cleaner);
  });

  it('is case-insensitive', () => {
    // Even though we pass capital letters, it should still match.
    expect(getCategoryColor('ClEaNeR')).toBe(CATEGORY_COLORS.cleaner);
  });

  it('returns the default color for an unknown category', () => {
    expect(getCategoryColor('unknown_job')).toBe(DEFAULT_CATEGORY_COLOR);
  });

  it('returns the default color when categoryName is null or undefined', () => {
    expect(getCategoryColor(null)).toBe(DEFAULT_CATEGORY_COLOR);
    expect(getCategoryColor(undefined)).toBe(DEFAULT_CATEGORY_COLOR);
    expect(getCategoryColor('')).toBe(DEFAULT_CATEGORY_COLOR);
  });
});
```

**Code Review Tip:** Reviewers love seeing tests grouped by edge cases. By explicitly covering `null` and `undefined`, you prove that this function won't crash the app if the backend sends unexpected data.

---

## 4. Testing APIs and Services (Mocking Axios)

When testing API services, you **never** want actually to hit the live backend. Instead, we use `jest.mock()` to intercept calls to Axios.

### Example: Testing `providersApi.ts`

```typescript
export const getProviders = async (
  latitude: string,
  longitude: string,
  distance: string
) => {
  const { data } = await api.get(
    `/providers?lat=${latitude}&lng=${longitude}&distance=${distance}`
  );
  return data;
};
```

**What must we test here?**

1. Does it formulate the URL correctly using the provided arguments?
2. Does it return the `data` object correctly from the Axios promise?

**The Test File (`__tests__/providersApi.test.ts`)**

```typescript
import { getProviders } from '../providersApi';
import { api } from '../client';

// 1. Tell Jest to intercept the 'client' file
jest.mock('../client');

describe('providersApi', () => {
  it('should fetch providers with the correct URL parameters', async () => {
    // 2. We create fake data that the "backend" will supposedly return.
    const mockData = [{ id: '1', name: 'John Doe' }];

    // 3. We tell our mocked api.get function: "When you are called, pretend you resolved successfully with this mockData inside a data object."
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    // 4. We call the actual function we are testing
    const result = await getProviders('40.7128', '-74.0060', '10');

    // 5. Assertions: We expect the function to return our mockData
    expect(result).toEqual(mockData);

    // 6. Assertion: We guarantee our function constructed the URL perfectly.
    // This protects us from someone accidentally deleting a parameter from the URL string in the future!
    expect(api.get).toHaveBeenCalledWith(
      '/providers?lat=40.7128&lng=-74.0060&distance=10'
    );
  });
});
```

---

## 5. Testing React Hooks

Testing Custom Hooks implies testing how State (`useState`) and Effects (`useEffect`) behave over time. We cannot just call a hook like a normal function (`const data = useGetProviders()`); React will throw an error because hooks must be called inside a React Component.

To bypass this, we use `@testing-library/react-native` which provides a helper function called `renderHook`.

### Example: Testing `useGetProviders`

```typescript
export default function useGetProviders(
  latitude: string,
  longitude: string,
  distance: string
) {
  const [providers, setproviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getNewProviders = async () => {
      // logic fetching data...
    };
    getNewProviders();
  }, [distance, latitude, longitude]);

  return { providers, loading };
}
```

**What must we test here?**

1. **Initial State/Missing Data:** If latitude/longitude is missing, does it immediately set `loading` to false and return empty providers?
2. **Success State:** If data is provided, does it fetch, populate the `providers` array, and set `loading` to false?

**The Test File (`__tests__/get-providers-hook.test.ts`)**

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import useGetProviders from '../get-providers-hook';
import { getProviders } from '@/core/services/api/providersApi';

// 1. Mock the API function so we don't make real requests.
jest.mock('@/core/services/api/providersApi');

describe('useGetProviders Hook', () => {
  // Clear mock history before every test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty list and loading=false if latitude or longitude is missing', async () => {
    // 2. Render the hook with missing values
    const { result } = renderHook(() => useGetProviders('', '', '10'));

    // 3. Wait for the state to settle
    await waitFor(() => {
      // The hook immediately returns if missing coords
      expect(result.current.loading).toBe(false);
      expect(result.current.providers).toEqual([]);
    });

    // Ensure we didn't accidentally fire the API
    expect(getProviders).not.toHaveBeenCalled();
  });

  it('should fetch providers and update state successfully', async () => {
    // Setup Mock Backend Response
    const mockProviders = [{ id: '1', name: 'Cleaner Pro' }];
    (getProviders as jest.Mock).mockResolvedValueOnce(mockProviders);

    // Render Hook with valid coords
    const { result } = renderHook(() => useGetProviders('10.0', '20.0', '5'));

    // Initially, it should be loading
    expect(result.current.loading).toBe(true);

    // 4. Wait for the asynchronous useEffect to finish
    await waitFor(() => {
      expect(result.current.loading).toBe(false); // API call done
      expect(result.current.providers).toEqual(mockProviders); // State populated
    });

    // Verify API was called with right arguments
    expect(getProviders).toHaveBeenCalledWith('10.0', '20.0', '5');
  });
});
```

**Code Review Tip:** Testing hooks requires checking the _lifecycle_ of the state. Showing that it starts `loading: true`, fetches data, and changes to `loading: false` proves to reviewers that you understand React's render cycles.

---

## 6. Testing UI Components (React Native Testing Library)

When testing components, we render them in a hidden "virtual" DOM. We then fire simulated button presses and read text off the screen.

For Expo/React Native apps, we use `@testing-library/react-native`.

**The Golden Rule of Component Testing:**

> **"Test behavior, not implementation details."**

Do not test if a variable named `isExpanded` is true. Instead, test if "The dropdown menu is visible to the user."

### Example: Testing a Button Component (`CallButton`)

**What must we test?**

1. Does it render correctly?
2. When pressed, does it invoke the right action (e.g., `Linking.openURL`)?

**The Test File (`__tests__/call-button.test.tsx`)**

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CallButton } from '../call-button';
import { Linking } from 'react-native';

// Mock Expo/React Native Linking API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  // Overwrite Linking specifically
  RN.Linking.openURL = jest.fn();
  return RN;
});

describe('CallButton Component', () => {
  it('should format the phone number properly and call openURL when pressed', () => {
    // 1. Render the component in virtual memory
    const { getByText } = render(<CallButton phoneNumber="0612345678" />);

    // 2. Find the button by its text.
    // If you used <Text>Appeler le fournisseur</Text>, find it by that string!
    const button = getByText('Appeler');

    // 3. Simulate a user tap
    fireEvent.press(button);

    // 4. Assert that the `Linking.openURL` system API was triggered
    // to open the phone dialer correctly.
    expect(Linking.openURL).toHaveBeenCalledWith('tel:0612345678');
  });
});
```

Using methods like `getByText` or `getByTestId` is the primary way you verify that elements exist on the screen.

---

### Final Code Review Checklist:

Before you submit your PR, ask yourself:

1. Did I mock external dependencies? (Axios, APIs, system libraries like Location or Linking).
2. Did I test edge cases? (Empty arrays, null inputs, API failures).
3. Do my assertions prove my business logic actually worked?
4. Do I use `await waitFor()` for any component/hook that updates state asynchronously?

_Happy Testing!_
