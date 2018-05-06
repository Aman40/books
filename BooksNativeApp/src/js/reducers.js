import * as booksActions from './books/books_actions'

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
			}
			break;
		case booksActions.SUCCESS_FETCHING_BOOKS:
			return {
				...state,
				booksArr: action.payload,
				successFetching: true,
				isFetching: false
			};
			break;
		case booksActions.ERROR_FETCHING:
			console.log("Error was dispatched");
			return {
				...state,
				isFetching: false,
				fetchErrorString: action.payload,
			};
			break;
		case booksActions.CLICKED_ITEM:
			return {
				...state,
				clickedOn: action.payload,
			}
		default:
			return state;
	}
}
//NOTES: Async functions should always dispatch 3 types of actions.
//1. When the action starts and the result is pending
//2. When the action ends successfully
//3. When the action ends in failure/an error.
