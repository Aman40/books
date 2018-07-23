export const IS_LOGGING_IN = "started login";
export const LOGIN_ERROR = "error logging in";
export const LOGIN_SUCCESS = "successfully logged in"; //Doesn't do any navigation
export const SHOW_AC_MENU = "show_account_header_menu";
export const HIDE_AC_MENU = "hide_account_menu";
export const IS_LOGGING_OUT = "started_logging_out";
export const LOGOUT_ERROR = "error_logging_out";
export const LOGOUT_SUCCESS = "successfully_logged_out";
//Fetching my books
export const SUCCESS_FETCHING_MY_BOOKS = "success fetching my books";
export const ERROR_FETCHING_MY_BOOKS = "error fetching my books";
export const IS_FETCHING_MY_BOOKS = "started fetching my books";
//Account control
export const SHOW_METHOD_SELECT_MENU = "show book add method select menu";
export const HIDE_METHOD_SELECT_MENU = "hide book add method select menu";
//Fetching ISBN data after barcode scan
export const ISBN_META_FETCH_START = "started fetching isbn meta";
export const ISBN_TO_META_SUCCESS = "successfully fetched isbn meta";
export const ISBN_TO_META_ERROR = "A problem or another occurred";
export const SHOW_SCAN_PREVIEW = "Show preview of scanned book";
export const HIDE_SCAN_PREVIEW = "Hide preview of scanned book";
export const RESET_SCANNED_BUFFER = "clean scanned buffer";
//For submitting new book data
export const IS_ADDING_BOOK = "submitting new book"; //Wait
export const ADD_BOOK_SUCCESS = "successfully added new book";
export const ADD_BOOK_ERROR = "failed to add a new book";
//Simulating singleton Screens/Routes.

//Showing an item's details
//Tells the next navigator which item's index was clicked 
//on. Payload is an integer representing the index of the clicked item in the array
export const CLICKED_ITEM = "clicked_item_in_my_books";
//Attempting to delete a book
export const DELETING_BOOK = "deleting_my_book";
export const SUCCESS_DELETING_BOOK = "deleted_my_book";
export const ERROR_DELETING_BOOK = "error_deleting_book"; 
