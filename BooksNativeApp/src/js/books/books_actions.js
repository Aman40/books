/*jshint esversion: 6 */
export const IS_FETCHING_BOOKS = "is_fetching_books"; //Display the spinner
export const SUCCESS_FETCHING_BOOKS = "finished_fetching_books"; //Success. There are at least 0 book items in the response.
//Set errorFetching to false
export const ERROR_FETCHING = "error_fetching";
//Sets the isFetching flag to false
export const CLICKED_ITEM = "clicked_item"; //Tells the next navigator which item's index was clicked on. Payload is an integer representing the index of the clicked item in the array
