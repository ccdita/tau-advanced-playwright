# Chapter 3 - Interacting with APIs

## The APIRequestContext

**RELEVANT FILES:**
- [`book-with-fixture-and-api-spec.ts`](../tests/ui/specs/book-with-fixture-and-api.spec.ts): Demonstrates how to interact with the API
- [`delete-books-collection.ts`](../tests/api/requests/delete-books-collection.ts): Contains methods for deleting books via the API

## How to identify an API call and use Swagger

**NOTES:**
- Methods to identify requests in an application:
    - Chrome DevTools Network tab
        - Filter requests by `Fetch/XHR` and the name of the request (usually the name of the page or something related to the flow of interest)
        - Find response info like `Request URL`, `Request Method`, `Status Code`, in the `Headers` tab
    - API Documentation (e.g., Swagger)
        - Lists all API methods for the application

- HTTP Methods
    - `GET`: Retrieves the data representation of the specified resource
    - `POST`: Updates the specified resource (often causes change in state or server side effects)
    - `PUT`: Replaces all current data of the target resource with the request content
    - `DELETE`: Deletes the specified resource
    - For more methods, see [HTTP request methods on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)

## Execute a request dynamically

**RELEVANT FILES:**
- [`book-with-fixture-and-api-spec.ts`](../tests/ui/specs/book-with-fixture-and-api.spec.ts)
- [`delete-books-collection.ts`](../tests/api/requests/delete-books-collection.ts)
- [`apiUrlBuilder.ts`](../tests/utils/apiUrlBuilder.ts): Constructs a URL for sending an API request
- [`apiRequestUtils.ts`](../tests/utils/apiRequestUtils.ts): Executes an API request, handles the response, and throws an error if the response is not successful

## Error handling

**RELEVANT FILES:** 
- [`apiRequestUtils.ts`](../tests/utils/apiRequestUtils.ts)