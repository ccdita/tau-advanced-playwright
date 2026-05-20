import uiPages from '../utils/uiPages';

/**
 * Builds a URL from the given parameters. For this function to work, we must understand
 * the application's path pattern
 * 
 * @param page, a key associated with a page path, which can be found in uiPages.ts
 * @param params, search parameters (optional)
 * @returns the built URL
 */
export function buildUrl(page: string, params?: Record<any, any>) {
  const uiPath = uiPages[page]; // Get the value associated with the pages key
    
  const qParams = new URLSearchParams(params); // Get the search parameters
  
  /**
   * If search parameters exist, concatenate them as a query string to the page path
   */
  const url = params
  ? `${uiPath.concat('?')}${qParams.toString()}`
  : uiPath; // Otherwise, we will just work with the page path

  /**
    * Example of variables for the books page
    * 
    * page  bookStore
    * uiPath  /books
    * params  { book: '9781449337711' }
    * qParams  URLSearchParams { 'book' => '9781449337711' }
    * url  /books?book=9781449337711
  */

  return url;
}
