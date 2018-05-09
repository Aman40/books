//This modules imports all the
import {StackNavigator} from 'react-navigation';
import React, {Component} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BooksView from './books_view'
import ConnectedBooksView from './books_connector'
import ConnectedBookDetails from './book_details'

export default BookDetailsStack = StackNavigator(
	{
		Home: {
			screen: ConnectedBooksView,
			navigationOptions: {
				title: "Add Search Bar",
			}
		},
		BookDetails: {
			screen: ConnectedBookDetails,
			navigationOptions: {
				title: "BookDetails"
			}
		}
	},
	{
		// TODO:
	}
)
