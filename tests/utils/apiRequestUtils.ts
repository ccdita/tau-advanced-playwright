import { APIRequestContext } from '@playwright/test';

/**
 * Executes an API request, handles the response, and throws an error if the response is not successful
 * 
 * @param apiContext, the APIRequestContext used to make the request
 * @param requestUrl, the URL to which the request is sent
 * @param method, the HTTP method for the request (e.g., GET, POST, DELETE)
 * @param requestOptions, an object containing additional options for the request, such as headers or body data
 * @returns the response from the server if the request is successful
 * @throws an error with detailed information if the request fails or if the response is not successful
 */
export async function executeRequest(
  apiContext: APIRequestContext,
  requestUrl: string,
  method: string,
  requestOptions: object
) {
  try {
    // Sends the API request using the specified method, URL, and options, and waits for the response from the server
    const response = await apiContext[method](requestUrl, requestOptions);
    const responseCode = await response.status(); // Retrieves the HTTP status code from the response, which indicates whether the request was successful (e.g., 200 for success, 404 for not found, etc.)
    const responseOk = await response.ok(); // Checks if the response status code indicates a successful request (i.e., in the range of 200-299). It returns true if the request was successful and false otherwise

    // If the response is not successful (i.e., responseOk is false), it constructs an error message with the status code, response status, and response body, and throws it as an error
    if (!responseOk) {
    // if (responseCode !== 200) {
      const errorStatus = `Code: ${responseCode} \r\n`;
      const responseStatus = `Status: ${responseOk} \r\n`;
      const errorResponse = `Response: ${await response.text()} \r\n`;
      throw `${errorStatus} ${errorResponse} ${responseStatus} `;
    }

    return response;

  } catch (error) {
    const errorRequestUrl = `Request url: ${requestUrl} \r\n`;
    const errorRequestMethod = `Method: ${method} \r\n`;
    const errorRequestOptions = `Request options: ${JSON.stringify(requestOptions)} \r\n`;

    throw new Error(
      `Invalid request! Failed on \'executeRequest\' method. \r\n ${errorRequestUrl} ${errorRequestMethod} ${errorRequestOptions} ${error}`
    );
  }
}

/*
* method delete
* requestUrl https://demoqa.com/BookStore/v1/Books?UserId=2f24c011-a654-4781-9f42-b8b6bfcf7d10
* requestOptions {}

* method post
* requestUrl https://demoqa.com/BookStore/v1/Books
* requestOptions {
    data: {
      userId: '2f24c011-a654-4781-9f42-b8b6bfcf7d10',
      collectionOfIsbns: [ [Object] ]
    }
  }

*/
