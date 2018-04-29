import ConnectedBooksView from './books/books_connector'
import {TabNavigator,
TabBarBottom} from 'react-navigation';
import BooksView from './books/books_view'
import React, {Component} from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default MainTabNav = TabNavigator(
	{
		Home: {
			screen: ConnectedBooksView, //Soon, a stack navigator instead.
			navigationOptions: {
				title: "Home",
			}
		},
		Temp: {
			screen: BooksView,
			navigationOptions: {
				title: "Temporary",
			}
		}
	},
	{
		tabBarOptions: {
			activeTintColor: 'blue',
			inactiveTintColor: 'gray'
		},
		tabBarComponent: TabBarBottom,
		tabBarPosition: 'bottom',
		animationEnabled: false,
		swipeEnabled: false,
	});
