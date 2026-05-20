# Chapter 2 - Dynamic Page Objects and Fixtures

### Hooks file for resuable pom creation

**RELEVANT FILES:**
- `playwright.config.ts`: Defines `globalSetup` and `storageState` for authentication and storing authentication state
- `profile-with-dynamic-pom.spec.ts`: Demonstrates use of hooks and verifies successful authentication
- `hooks.ts`: Contains a special function `beforeEach()` that navigates to a specific URL and instantiates a page object

### URL Builder for dynamic url creation

**RELEVANT FILES:**
- `uiUrlBuilder.ts`: Builds a URL based on given parameters
- `book-with-dynamic-pom.spec.ts`: Similar to `profile-with-dynamic-pom.spec.ts`

## Fixture file for reusable flows

**RELEVANT FILES:**
- `book-with-fixture-and-api.spec.ts`: Demonstrates how tests use fixtures like `bookPage`
- `books-fixture.ts`: A reusable component that defines a `bookPage` fixture to be used by tests. The fixture contains setup, use(), and teardown actions

**NOTES:**
- Essentially an evolved version of a hook file
- With a fixture, can group tests based on their meanings instead of their setup
- Fixtures are reusable components used to establish an isolated environment for each test, with actions for setup, use() (executing code in test files), and teardown
- Use custom fixtures in moderation, as they can get very confusing!

## Review of how to use the fixture file

**NOTES:**
1. Import the fixture file instead of `@playwright/tests` in the test file (see `book-with-fixture-and-api.spec.ts`, line 1, for example)
2. Once the test identifies the `bookPage` fixture, the fixture will be called
3. In the fixture file, the POM is created using `hooks.beforeEach()`
4. In the fixture file, `use()` returns to the test file and executes code within that file
5. After code in the test file is executed, the fixture resumes execution after the `use()`
