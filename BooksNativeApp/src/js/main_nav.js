import BookDetailsStack from "./books/home_stacknav";
import {TabNavigator,
	TabBarBottom} from "react-navigation";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import PastPaperStack from "./past-papers/pp_mainstack";
import AccountStack from "./account/ac_stacknav";

let MainTabNav = TabNavigator(
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
					/>);
				}
			}
		},
		Temp: {
			screen: PastPaperStack,
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
		},
		Account: {
			screen: AccountStack,
			navigationOptions: {
				title: "Account",
				tabBarIcon: ({focused, tintColor})=>{
					return (<Ionicons
						name={"ios-person-outline"}
						size={25}
						color={tintColor}
					/>);
				}
			}
		}
	},
	{
		tabBarOptions: {
			activeTintColor: "blue",
			inactiveTintColor: "gray"
		},
		tabBarComponent: TabBarBottom,
		tabBarPosition: "bottom",
		animationEnabled: false,
		swipeEnabled: false,
	});

export default MainTabNav;