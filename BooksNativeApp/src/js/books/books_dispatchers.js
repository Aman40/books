import * as booksActions from './books_actions'
export function fetchBooks() {
	return {
		type: booksActions.FETCH_BOOKS,
		payload: null,
	}
}
