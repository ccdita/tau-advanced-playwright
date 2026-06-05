# Chapter 4 - Data management

## Data management via .env files

**RELEVANT FILES:**
- `.env`: Stores environment variables
- `.env.example`: Provides a template for the environment variables
- `.gitignore`: Specifies which files git should ignore. `.env` is typically included in this file

**NOTES:**
- Stores sensitive data locally on your machine, on the server, or in the CI
- Typically specified in the `.gitignore` file
- Usage:
    - Add `require('dotenv').config()` in `playwright.config.ts`
    - Use `process.env.VARIABLE!` to use a specific environment variable
        - The exclamation mark tells Typescript that the variable exists
- An example of storing data in the CI is the `playwright.yml` file, which uses `secrets` and `vars`
    - Secrets won't be logged, whereas variables will be logged
    - In GitHub, access `secrets` and `vars` via Settings -> Secrets and variables -> Actions

## Data management via JSON files

**RELEVANT FILES:**
- [`user-data.ts`](../tests/data/user-data.ts): Demonstrates the use of JSON format
- [`environmentBaseUrl.ts`](../tests/utils/environmentBaseUrl.ts)

## Data management via API requests

**RELEVANT FILES:**
- [`book-with-fixture-and-api-isolated-auth.spec.ts`](../tests/ui/specs/book-with-fixture-and-api-isolated-auth.spec.ts): Demonstrates manipulating data via the API

**NOTES:**
- Manipulate data via the API or directly via a database by connecting to the database and modifying the data there
- It is recommended to use the API because it usually has rules that enforce data consistency in the database

## Data management via intercepting an HTTPS request

**RELEVANT FILES:**
- [`profile-api-interception.spec.ts`](../tests/ui/specs/profile-api-interception.spec.ts): Demonstrates how to manage data by intercepting an HTTPS request and mocking a response

**NOTES:**
- Intercept an HTTPS request in the browser, and then mocking a response
- Useful for:
    - Testing third parties where you cannot change the response
        - E.g., testing a scenario when PayPal is down
        - Make the API call, mock the response from the server to fail the test
    - When you can't change data in the database
        - You can force data in the response and then load the UI, which you then test
        - Make sure your integration works with the API if you are mocking the response!

## Data management via CSV file

**NOTES:**
- In any spec file or file in the test suite, import `fs` (a file system function) to transform and read the CSV file into an object
- See [Create tests via a CSV file on Playwright Docs](https://playwright.dev/docs/test-parameterize#create-tests-via-a-csv-file)
