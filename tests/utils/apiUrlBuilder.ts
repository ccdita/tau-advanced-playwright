import apiPath from './apiPaths';
import baseAPIUrl from './environmentBaseUrl';
import endpoints from './apiEndpoints';
/**
 * Constructs the full URL for an API request
 * 
 * @param endpoint, the specific API endpoint to be accessed
 * @param env, the environment for which the URL is being built (e.g., development, staging, production)
 * @param userId, the ID of the user, which may be required for certain API endpoints to specify which user's data is being accessed or modified
 * @param isbn, the International Standard Book Number, which may be required for certain API endpoints related to books to specify which book's data is being accessed or modified
 * @returns the full URL for the API request, which is constructed by combining the base URL with the specific endpoint and any necessary query parameters based on the provided arguments
 */
function bindUrl(endpoint: string, env: string, userId?: string, isbn?: string) {
  /**
   * The endpoint string is processed to extract the relevant parts for constructing the URL
   * - The regex /\/.+$/ is used to remove any trailing path segments from the endpoint, leaving only the main parts separated by dots
   * - For example, if the endpoint is "api.books/delete", it will be split into ["api", "books"] after removing any trailing segments
   * - This allows for dynamic construction of URLs based on the defined endpoints and their corresponding paths in the apiPath object
   */
  const parts = endpoint.replace(/\/.+$/, '').split('.');
  
  /**
   * The endpointParts array is created by mapping over the extracted parts and replacing them with their corresponding values from the baseAPIUrl and apiPath objects
   * - For each part in the endpoint, it checks if it matches "api" and replaces it with the base API URL for the specified environment
   * - For other parts, it looks up their corresponding paths in the apiPath object and replaces them accordingly
   * - If a part does not have a corresponding value in the apiPath object, it returns '/'
   * - This allows for flexible construction of URLs based on the defined endpoints and their corresponding paths, while also handling cases where certain parts may not be defined in the apiPath object
   */
  const endpointParts = parts.map((part) => {
    switch (part) {
      case 'api':
        return baseAPIUrl[env].api;
      default:
          return apiPath[part] ?? '/';
    }
  });
  
  /**
   * Depending on the specific endpoint being accessed, additional parameters such as userId or isbn may be appended to the endpointParts array to further specify the URL
   * - For example, if the endpoint is "api.account/get", the userId will be appended to the endpointParts array to specify which user's account information is being accessed
   * - Similarly, if the endpoint is "api.books/put", the isbn will be appended to specify which book's information is being modified
   * - This allows for dynamic construction of URLs based on the specific requirements of each API endpoint, ensuring that the necessary parameters are included in the URL for proper functionality
   */
  if (endpoint === endpoints.account.get) {
    endpointParts.push(userId);
  }
  if (endpoint === endpoints.books.put) {
    endpointParts.push(isbn);
  }

  // The endpointParts array is joined together with '/' to form the final URL for the API request
  return endpointParts.join('/');
}

/**
 * Constructs the query parameters for an API request based on the page and user ID
 * 
 * @param page, the specific API endpoint being accessed, which determines the structure of the query parameters
 * @param userId, the ID of the user, which may be included in the query parameters for certain API endpoints to specify which user's data is being accessed or modified
 * @returns a string representation of the query parameters for the API request, which is constructed based on the provided page and userId arguments
 * The query parameters are formatted as key-value pairs and joined together with '&' to form a valid query string that can be appended to the URL for the API request
 */
function searchParamsForUrl(page: string, userId?: string) {
  let queryParams;

  /**
   * The structure of the query parameters is determined based on the specific page (or API endpoint) being accessed
   * - For example, if the page is "api.books/delete", the query parameters will include the userId to specify which user's books are being deleted
   * - For other pages, the query parameters may be empty or structured differently based on the requirements of the API endpoint
   * - This allows for dynamic construction of query parameters based on the specific needs of each API endpoint, ensuring that the necessary information is included in the API request for proper functionality
   */
  switch (page) {
    case endpoints.books.delete:
      queryParams = { UserId: userId };;
      break;
    default:
      queryParams = {};
  }

  return new URLSearchParams(queryParams).toString();
}

/**
 * Builds the full URL for an API request by combining the base URL, endpoint, and any necessary query parameters
 * 
 * @param endpoint, the specific API endpoint to be accessed, which determines the structure of the URL and any necessary parameters
 * @param userId, the ID of the user, which may be included in the URL for certain API endpoints to specify which user's data is being accessed or modified
 * @param isbn, the International Standard Book Number, which may be included in the URL for certain API endpoints related to books to specify which book's data is being accessed or modified
 * @returns the full URL for the API request
 */
export function buildUrl(endpoint: string, userId?: string, isbn?: string) {
  const env = process.env.ENV!; // Determines the environment for which the URL is being built (e.g., development, staging, production)
  const url = [
    bindUrl(endpoint, env, userId, isbn),
    searchParamsForUrl(endpoint, userId),
  ]
  .filter(Boolean) // Filters out any empty strings from the array, ensuring that only valid parts of the URL are included in the final result
  .join('?'); // Joins the remaining parts of the URL together with a '?' to form the final URL for the API request
  
  return url;
}

/**
  * endpoint  api.books/delete
  * parts  [ 'api', 'books' ]
  * endpointParts  [ 'https://demoqa.com', 'BookStore/v1/Books' ]
  * endpointParts join  https://demoqa.com/BookStore/v1/Books
  * queryParams { UserId: '1117e3d4-9f6e-45a7-a8a9-db3ecf7b9603' }
  * url  https://demoqa.com/BookStore/v1/Books?UserId=1117e3d4-9f6e-45a7-a8a9-db3ecf7b9603
 */
