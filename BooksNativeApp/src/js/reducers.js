import * as booksActions from "./books/books_actions";
import * as accountActions from "./account/ac_actions";

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
	}, action
) {
	switch (action.type) {
	case accountActions.IS_FETCHING_MY_BOOKS:
		return {
			...state,
			isFetching: true,
			successFetching: false,
			fetchErrorString: null,
			booksArr: [],			
			fetchStatusString: "Fetching books",
		};
	case accountActions.SUCCESS_FETCHING_MY_BOOKS:
		return {
			...state,
			isFetching: false,
			successFetching: true,
			booksArr: action.payload, //obj expected
			fetchStatusString: "Done fetching books",
		};
	case accountActions.ERROR_FETCHING_MY_BOOKS:
		return {
			...state,
			isFetching: false,
			successFetching: false,
			fetchErrorString: action.payload,
			fetchStatusString: "Error: "+action.payload,
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
		};
	case accountActions.LOGIN_SUCCESS:
		console.log("We are logged in yo!");
		return {
			...state,
			loginWait: false,
			loginSuccess: true,
			isLoggedIn: true,
			userData: action.payload,
		};
	case accountActions.LOGIN_ERROR:
		return {
			...state,
			loginWait: false,
			loginSuccess: false,
			loginErrorMsg: action.payload,
			isLoggedIn: false,
			userData: "",
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
		};
	case accountActions.LOGOUT_ERROR:
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
	default:
		return {
			...state,
		};
	}
}
//NOTES: Async functions should always dispatch 3 types of actions.
//1. When the action starts and the result is pending
//2. When the action ends successfully
//3. When the action ends in failure/an error.
