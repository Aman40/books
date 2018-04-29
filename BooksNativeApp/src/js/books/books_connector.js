import BooksView from './books_view';
import {connect} from 'react-redux';
import * as dispatchers from './books_dispatchers'
import store from '../store'
import {Provider} from 'react-redux';
import React, {Component} from 'react';
function mapStateToProps(state) {
	return {books: state.books}
}
//connect the BooksView to the store
let Connected = connect(mapStateToProps, dispatchers)(BooksView);
export default class ConnectedBooksView extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<Connected
					navigation={this.props.navigation}
				/>
			</Provider>
		)
	}
}