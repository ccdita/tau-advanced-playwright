import { APIRequestContext } from '@playwright/test';
import { buildUrl } from '../../utils/apiUrlBuilder';
import { executeRequest } from '../../utils/apiRequestUtils';
import endpoints from '../../utils/apiEndpoints';
import methods from '../../utils/apiMethods';

async function addBookToCollection(apiContext: APIRequestContext, userId: string, isbn: string) {
  const method = methods.post;
  const requestOptions = { data: { userId: userId, collectionOfIsbns: [ {isbn: isbn} ] }};
  const requestUrl = buildUrl(endpoints.books.post, userId, isbn);
  const response = await executeRequest(apiContext, requestUrl, method, requestOptions);
}

/**
 * Adds books from the given array to the user's collection
 * - We could replace addBookToCollection with this method, but we will not in case addBookToCollection is used in
 * later chapters
 * - Solution to Ch 3, exercise 2
 * 
 * @param apiContext to execute the request with
 * @param userId of the user to add the books to
 * @param isbns, an array of ISBNs to add to the collection
 */
async function addListOfBooksToCollection(apiContext: APIRequestContext, userId: string, isbns: Array<string>) {
  const method = methods.post;
  const requestOptions = {
    data: {
      userId: userId,
      /**
       * Loop over each isbn in the array, wrap it inside an object with a key called isbn, then
       * return these objects in a new array
       */
      collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
    },
  }
  const requestUrl = buildUrl(endpoints.books.post, userId);
  const response = await executeRequest(apiContext, requestUrl, method, requestOptions);
}

export default { addBookToCollection, addListOfBooksToCollection };
