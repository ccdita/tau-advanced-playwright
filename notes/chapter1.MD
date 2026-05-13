# Chapter 1 - Optimizing Authentication

## Chapter 1.1

### How regular auth works with page objects

**RELEVANT FILES:**
- `login.spec.ts`: Manual sign-in, to be used repeatedly for tests
- `login-page.ts`: POM of login page
- `profile-stored-authentication.spec.ts`: Leverages Playwright for storing authentication state using `global-setup.ts`
- `profile-page.ts`: POM of profile page (accessible after login)

**NOTES:**
- `login.spec.ts` demonstrates manually logging in. In testing applications, we repeat these steps for every test. 
- `profile-stored-authentication.spec.ts` and `profile-page.ts` demonstrate how Playwright stores the log-in state so that we do not have to manually (and repeatedly) sign in for every single test

### How to store the auth with global setup via UI

**RELEVANT FILES:**
- `playwright.config.ts`: Playwright configuration file, which defines `baseURL`, `storageState`, and `globalSetup`
- `global-setup.ts`: Handles sign-in and authentication states; runs once per test command
- `storageState.json`: Stores authentication states (cookies and origins)
- `login.spec.ts`

**NOTES:**
- Two items essential for reusing the sign-in state:
    1. `globalSetup`: performs the sign-in action and creates a JSON file to store the sign-in state, which will be reused across other tests
        - Every time a test command is run, `globalSetup` runs once
        - `globalSetup` can be stored in a server or local machine, as long as you have a way to save sign-in states on the machine the tests are running on
    2. `storageState`: stores the sign-in state
- Make sure to run the tests in serial mode, to avoid tests failing due to trying to use the same session at the same time:

    `test.describe.configure({ mode: 'serial' });`

## Chapter 1.2

### How to store the auth for multiple roles in a project

**RELEVANT FILES:**
- `profile-stored-auth-multi-role-admin.spec.ts`: Tests that the admin successfully logged in; demonstrates how `storageState` can be defined at the beginning of the file
- `.auth/admin.json`: Stores log-in state of admin
- `profile-stored-auth-multi-role-user.spec.ts`: Tests that the user successfully logged in; demonstrates how `storageState` can be defined inside test describes
- `.auth/user.json`: Stores log-in state of user
- `playwright.config.ts`
- `auth-setup.ts`: Similar to `global-setup.ts`, except it sets up authentication for multiples users/roles
- `package.json`: Contains test scripts for running commands to trigger relevant tests
- `profile-stored-auth-multi-role-example.spec.ts`: Demonstrates how Playwright can create multiple contexts for different users/roles inside one test, so that they run simultaneously


**NOTES:**
- In `playwright.config.ts`, for multi-session/user tests:
    - Remove `globalSetup` and `storageState` as they cannot be used simultaneously
    - Add a project called `auth-setup` for the `auth-setup.ts` file
    - Add a project called `chromium-auth` (arbitrary name) and add the `auth-setup` project as a dependency

### How to store auth via API request

- Instead of storing authentication states based on the UI, we can use API requests (`post`)
- Useful because it doesn't require loading the UI, which can increase test runtime

```typescript
const authFile = '.auth/user.json';

setup('authenticate', async ({ request }) => {
    // Send authentication request. Replace with your own
    await request.post('https://github.com/login', { // Send data to the server
        form: {
            'user': 'user',
            'password': 'password'
        }
    });
    await request.storageState({ path: authFile }); // Capture authentication state
});
```

### Why use a reusable sign-in state?
- Decreases test runtime
- Reduces lines of code
