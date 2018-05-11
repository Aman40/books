import * as booksActions from "./books/books_actions";
import * as accountActions from "./account/ac_actions";

export function books(
	state={
		isFetching: false, //Started fetching?
		successFetching: false, //Ended successfully
		fetchErrorString: null,
		offSet: 0, //From the start
		count: 50, //Fetch 50 at a time
		booksArr: [],
		clickedOn: 0,
	},action
) {
	switch (action.type) {
	case booksActions.IS_FETCHING_BOOKS:
		return {
			...state,
			isFetching: true,
		};
	case booksActions.SUCCESS_FETCHING_BOOKS:
		return {
			...state,
			booksArr: action.payload,
			successFetching: true,
			isFetching: false
		};
	case booksActions.ERROR_FETCHING:
		return {
			...state,
			isFetching: false,
			fetchErrorString: action.payload,
		};
	case booksActions.CLICKED_ITEM:
		return {
			...state,
			clickedOn: action.payload,
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
			refererView: action.payload,
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
	default:
		return state;

	}
}
//NOTES: Async functions should always dispatch 3 types of actions.
//1. When the action starts and the result is pending
//2. When the action ends successfully
//3. When the action ends in failure/an error.
