import * as booksActions from "./books/books_actions";
import * as accountActions from "./account/ac_actions";
//import {objectToString} from "./shared_components/shared_utilities";
import { isbn as ISBN } from "simple-isbn";
import { actions as inetActions } from "./no_inet_gen_comp";

export function books(
	state={
		isFetching: false, //Started fetching?
		successFetching: false, //Ended successfully
		fetchErrorString: null,
		offSet: 0, //From the start - shared
		count: 50, //Fetch 50 at a time - shared
		booksArr: [],
		clickedOn: 0, //Shared
		isSearching: false,
		successSearching: false,
		searchStatusString: "",
		searchErrorString: "",
		searchResultsArr: [],
	},action
) {
	switch (action.type) {
	case booksActions.IS_FETCHING_BOOKS:
		return {
			...state,
			isFetching: true,
			searchStatusString: "Fetching books. Please wait...",
			fetchErrorString: "",
		};
	case booksActions.SUCCESS_FETCHING_BOOKS:
		return {
			...state,
			booksArr: action.payload,
			successFetching: true,
			isFetching: false,
			searchStatusString: `Found ${action.payload.length.toString()} results`,
		};
	case booksActions.ERROR_FETCHING:
		return {
			...state,
			isFetching: false,
			fetchErrorString: action.payload,
			searchStatusString: "An error occurred. "+action.payload,
		};
	case booksActions.CLICKED_ITEM:
		return {
			...state,
			clickedOn: action.payload,
		};
	case booksActions.SEARCH_START:
		return {
			...state,
			isSearching: true,
			searchStatusString: "Searching. Please wait...",
		};
	case booksActions.SEARCH_SUCCESS:
		return {
			...state,
			searchResultsArr: action.payload,
			successSearching: true,
			isSearching: false,
			searchStatusString: `Found ${action.payload.length.toString()} results`,
		};
	case booksActions.SEARCH_ERROR:
		return {
			...state,
			isSearching: false,
			searchErrorString: action.payload,
			searchStatusString: "An error occurred. "+action.payload,
		};
	default:
		return state;
	}
}

export function myBooks(
	state={
		isFetching: false,
		successFetching: false,
		fetchErrorString: null,
		fetchStatusString: "",
		offSet: 0, //Actions for this later. 
		count: 50,// This too
		booksArr: [],
		clickedOn: 0,
		isSearching: false, //Searching from own books
		successSearching: false,
		searchStatusString: "",
		searchErrorString: "",
		searchResultsArr: [],
		shouldPullDB: false, //Poll db or not
		isbnList: []
	}, action
) {
	switch (action.type) {
	case accountActions.IS_FETCHING_MY_BOOKS:
		return {
			...state,
			isFetching: true,
			successFetching: false,
			fetchErrorString: null,
			fetchStatusString: "Fetching books",
		};
	case accountActions.SUCCESS_FETCHING_MY_BOOKS:
		return {
			...state,
			isFetching: false,
			successFetching: true,
			booksArr: action.payload, //obj expected
			fetchStatusString: "Done fetching books",
			isbnList: (()=>{
				//An array of objects is in action.payload [{ISBN: "",...},{},...]
				return action.payload.map((obj)=>{
					return obj.ISBN;
				});
			})(),
		};
	case accountActions.ERROR_FETCHING_MY_BOOKS:
		return {
			...state,
			isFetching: false,
			successFetching: false,
			fetchErrorString: action.payload,
			fetchStatusString: "Error: "+action.payload,
		};
	case accountActions.CLICKED_ITEM:
		return {
			...state,
			clickedOn: action.payload,
		};
	case accountActions.SHOULD_PULL_DB:
		return {
			...state,
			shouldPullDB: !state.shouldPullDB, //Reverse
		};
	case accountActions.ADD_BOOK_SUCCESS: //A bit foreign, this action type
		return {
			...state,
			isbnList: state.isbnList.slice(0, state.isbnList.length).push(action.payload),
		};
	default:
		return state;
	}
}

export function session(state={
	promptLogin: false,
	loginWait: false,
	loginSuccess: false,
	loginErrorMsg: "",
	isLoggedIn: false,
	userData: "",
	logoutWait: false,
	logoutSuccess: false,
	logoutErrorMsg: "",
	hasInternet: false,
}, action) {
	switch (action.type) {
	case accountActions.IS_LOGGING_IN:
		return {
			...state,
			promptLogin: false,
			loginWait: true,
			loginSuccess: false,
			isLoggedIn: false,
			userData: "",
			logoutSuccess: false,
			loginErrorMsg: null,
			hasInternet: false, //False until proven otherwise
		};
	case accountActions.LOGIN_SUCCESS:
		console.log("We are logged in yo!");
		return {
			...state,
			loginWait: false,
			loginSuccess: true,
			isLoggedIn: true,
			userData: action.payload,
			hasInternet: true,
		};
	case accountActions.LOGIN_ERROR:
	//Send different error codes to determine whether connected to the 
	//Internet or not.
		console.log("Code is: "+action.payload.code);
		return {
			...state,
			loginWait: false,
			loginSuccess: false,
			loginErrorMsg: action.payload,
			isLoggedIn: false,
			userData: "",
			hasInternet: action.payload.code===2?true:false,
		};
	case accountActions.IS_LOGGING_OUT:
		return {
			...state,
			logoutWait: true,
			logoutErrorMsg: "",
			logoutSuccess: false,
			loginSuccess: false,
		};
	case accountActions.LOGOUT_SUCCESS:
		return {
			...state,
			logoutWait: false,
			isLoggedIn: false,
			logoutSuccess: true,
			userData: "",
			hasInternet: true,
		};
	case accountActions.LOGOUT_ERROR:
	//Send different error codes to determine whether connected to the 
	//Internet or not.
		return {
			...state,
			logoutSuccess: false,
			logoutErrorMsg: action.payload,
		};
	default:
		return state;

	}
}

export function guiControl(
	state={
		showAccountHeaderMenu: false,
		searchMode: false,
		showBookAddMethodSelectorMenu: false,
		showScanPreview: false,
		/**
		 * Managing the screens for adding books. A flag and string
		 * var are used, i.e shouldPop<bool> and popTo<route>.
		 * The screens BarcodeScanner, ScanPreview and AddBook will
		 * receive the props and will navigation.goBack() in their
		 * componentDidUpdate IF shouldPop: true and navigation.state
		 * !=== popTo. ELSE, they'll reset shouldPop: false and 
		 * popTo: "", TODO: If replace() and goBackFrom() work,
		 * delete this.
		 */
		shouldPop: false,
		popTo: ""
	},
	action
){
	switch(action.type) {
	case accountActions.SHOW_AC_MENU:
		return {
			...state,
			showAccountHeaderMenu: true,
		};
	case accountActions.HIDE_AC_MENU:
		return {
			...state,
			showAccountHeaderMenu: false,
		};
	case booksActions.TOGGLE_SEARCH_MODE:
		return {
			...state,
			searchMode: !state.searchMode,
		};
	case accountActions.SHOW_METHOD_SELECT_MENU:
		return {
			...state,
			showBookAddMethodSelectorMenu: true,
		};
	case accountActions.HIDE_METHOD_SELECT_MENU:
		return {
			...state,
			showBookAddMethodSelectorMenu: false,
		};
	case accountActions.SHOW_SCAN_PREVIEW:
		return {
			...state,
			showScanPreview: true,
		};
	case accountActions.HIDE_SCAN_PREVIEW:
		return {
			...state,
			showScanPreview: false,
		};
	default:
		return {
			...state,
		};
	}
}
export function booksToAdd(
	state={
		fetchingWait: false,
		fetchMetaSuccess: false,
		fetchMetaFail: false,
		fetchMetaError: {
			code: null,
			msg: "",
			/**
			 * Error codes: Solution
			 * 0. Invalid ISBN: Rescan or type
			 * 1. Network fail: Check your network
			 * 2. Server error: Try again later
			 * 3. No data: Skip For Later Manual Entry
			 * //Send a reset action to clear this data at start and end of the session
			 */
		},
		scannedBookMetaObject: {},
		scannedIsbnList: [], //Deprecated
	},
	action
) {
	switch(action.type) {
	case accountActions.ISBN_META_FETCH_START:
		return {
			...state,
			fetchingWait: true,
			fetchMetaSuccess: false,
			fetchMetaFail: false,
			fetchMetaError: {
				code: null,
				msg: "",
			},
			scannedBookMetaObject: {},
		};
	case accountActions.ISBN_TO_META_SUCCESS:
		return {
			...state,
			fetchingWait: false,
			fetchMetaSuccess: true,
			fetchMetaFail: false,
			scannedIsbnList: (()=>{
				let new_arr = state.scannedIsbnList.slice(0, state.scannedIsbnList.length);
				new_arr.push(action.payload.isbn);
				return new_arr;
			})(),
			scannedBookMetaObject: {
				...action.payload.resultObj,
				isbn: ISBN.toIsbn13(action.payload.isbn),
			},
		};
	case accountActions.ISBN_TO_META_ERROR:
		return {
			...state,
			fetchingWait: false,
			fetchMetaSuccess: false,
			fetchMetaFail: true,
			fetchMetaError: {
				code: action.payload.code,
				msg: action.payload.msg,
			},
			scannedBookMetaObject: {}
		};
	default: 
		return state;
	}
}
export function addNewBook(state={
	isAddingNewBook: false,
	addSuccess: false,
	addError: null,
}, action) {
	switch(action.type) {
	case accountActions.IS_ADDING_BOOK:
		return {
			...state,
			isAddingNewBook: true,
			addSuccess: false,
			addError: {},
		};
	case accountActions.ADD_BOOK_SUCCESS:
		return {
			...state,
			isAddingNewBook: false,
			addSuccess: true,
			addError: {},
		};
	case accountActions.ADD_BOOK_ERROR:
		return {
			...state,
			isAddingNewBook: false,
			addSuccess: false,
			addError: action.payload,
			/**
			 * addError: {
			 * 		errCode: <Number>,
			 * 		errMsg: if(errCode==4) {
			 * 					return err_obj<Object>
			 * 				} else {
			 * 					return <String>
			 * 				}
			 * 		}
			 */
		};
	default:
		return state;
	}

}
export function deleteBook(state={
	isDeletingBook: false,
	deleteSuccess: false,
	deleteError: null,
},action) {
	switch(action.type){
	case accountActions.DELETING_BOOK:
		return {
			...state,
			isDeletingBook: true,
			deleteSuccess: false,
			deleteError: null,
		};
	case accountActions.SUCCESS_DELETING_BOOK:
		return {
			...state,
			isDeletingBook: false,
			deleteSuccess: true,
		};
	case accountActions.ERROR_DELETING_BOOK:
		return {
			...state,
			deleteSuccess: false,
			isDeletingBook: false, //No need to wait anymore
			deleteError: action.payload,
		};
	default:
		return state;
	}
}

export function noInternet(state={
	retrying: false,
	restored: false,
	failed: null,
	loggedIn: false,
},action) {
	switch(action.type) {
	case inetActions.STARTED_REFRESHING:
		return {
			...state,
			restored: false,
			failed: false,
		};
	case inetActions.ERROR_REFRESHING:
		return {
			...state,
			retrying: false,
			restored: false,
			failed: true,
		};
	case inetActions.SUCCESS_REFRESHING:
		return {
			...state,
			retrying: false,
			restored: true,
			failed: false,
		};
	default:
		return state;
	}
}
//NOTES: Async functions should always dispatch 3 types of actions.
//1. When the action starts and the result is pending
//2. When the action ends successfully
//3. When the action ends in failure/an error.
//TODO 180606: Map ISO 639-1 Alpha-2 to language names