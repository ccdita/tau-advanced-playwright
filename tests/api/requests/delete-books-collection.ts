import { APIRequestContext } from '@playwright/test';
import { buildUrl } from '../../utils/apiUrlBuilder';
import { executeRequest } from '../../utils/apiRequestUtils';
import endpoints from '../../utils/apiEndpoints';
import methods from '../../utils/apiMethods';

async function deleteAllBooksByUser(apiContext: APIRequestContext, userId: string) {
  const method = methods.delete; // HTTP method for the request, which is "DELETE" in this case, indicating that we want to delete resources on the server
  const requestOptions = {}; // An empty object for request options, which can be used to specify additional parameters for the API request
  // Constructs the full URL for the API request by combining the base URL with the specific endpoint for deleting books, and it also includes the userId as a parameter in the URL
  const requestUrl = buildUrl(endpoints.books.delete, userId);
  // Executes the API request with the specified parameters and returns the response from the server
  const response = await executeRequest(apiContext, requestUrl, method, requestOptions);
}

async function deleteBookAPIByIsbn(apiContext: APIRequestContext, userId: string, isbn: string) {
  const method = methods.delete;
  const requestOptions = { data: { isbn: isbn, userId: userId }};
  const requestUrl = buildUrl(endpoints.books.delete);
  const response = await executeRequest(apiContext, requestUrl, method, requestOptions);
}

export default { deleteAllBooksByUser, deleteBookAPIByIsbn };
