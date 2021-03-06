import {
	TabNavigator,
	TabBarBottom,
} from "react-navigation";
import MyBooks from "./my_books";
import MyPastPapers from "./my_pastpapers";
import MyProfile from "./my_profile";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
// import univ_const from "../../../univ_const";
let AccountTabNav = TabNavigator(
	{
		MyBooks: {
			screen: MyBooks,
			tabBarIcon: ({focused, tintColor})=>{
				return (<Ionicons
					name={"ios-person-outline"}
					size={25}
					color={tintColor}
				/>);
			}
		},
		MyPastPapers: {
			screen: MyPastPapers,
			tabBarIcon: ({focused, tintColor})=>{
				return (<Ionicons
					name={"ios-person-outline"}
					size={25}
					color={tintColor}
				/>);
			}
		},
		MyProfile: {
			screen: MyProfile,
			tabBarIcon: ({focused, tintColor})=>{
				return (<Ionicons
					name={"ios-person-outline"}
					size={25}
					color={tintColor}
				/>);
			}
		}
	},
	{
		tabBarOptions: {
			activeTintColor: "#F57900",
			inactiveTintColor: "grey",
			activeBackgroundColor: "white",
			inactiveBackgroundColor: "white"
		},
		tabBarComponent: TabBarBottom,
		tabBarPosition: "top",
		animationEnabled: true,
		swipeEnabled: true,
	}
);
export /*to ac_stacknav*/  default AccountTabNav;