import * as reducers from "./reducers";
import {combineReducers} from "redux";
import {createStore} from "redux";

const store = createStore(
	combineReducers(
		{
			books: reducers.books,
			myBooks: reducers.myBooks,
			session: reducers.session,
			guiControl: reducers.guiControl,
			booksToAdd: reducers.booksToAdd,
			addNewBook: reducers.addNewBook,
			deleteBook: reducers.deleteBook,
			noInternet: reducers.noInternet,
			signUp: reducers.signUp,
		}
	)
);
export default store;