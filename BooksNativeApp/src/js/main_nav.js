import BookDetailsStack from './books/home_stacknav'
import {TabNavigator,
TabBarBottom} from 'react-navigation';
import BooksView from './books/books_view'
import React, {Component} from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import PastPapersHome from './past-papers/pp_mainstack';

export default MainTabNav = TabNavigator(
	{
		Home: {
			screen: BookDetailsStack, //Soon, a stack navigator instead.
			navigationOptions: {
				title: "Books",
				tabBarIcon: ({focused, tintColor})=>{
					return (<Ionicons
								name="ios-book-outline"
								size={25}
								color={tintColor}
							/>)
				}
			}
		},
		Temp: {
			screen: PastPapersHome,
			navigationOptions: {
				title: "Past Papers",
				tabBarIcon: ({focused, tintColor})=>{
					return (<Ionicons
						name={"ios-paper-outline"}
						size={25}
						color={tintColor}
					/>);
				},
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
