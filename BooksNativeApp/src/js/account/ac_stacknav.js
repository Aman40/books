/*
StackNavigator{Switch: {AccountHome || SignUpIn}, SignIn}
This defines 3 things.
1. The SignUpIn component to ask the user to sign up/in.
2. The "Switch". This either loads the the SignUpIn component,
	or the user AccountHome TabNav depending on whether the user is logged in or not
*/
import React from "react";
import {StackNavigator} from "react-navigation";
import SignIn from "./view_signin";
import SignUpForm from "./signup";
import Switch from "./ac_switch";
import TitleBar from "./titlebar";
import AddBook from "./add_book_stack";
import ConnectedBookDetails from "./book_details";
import ScanRoutine from "./scan_routine_switch_nav";

let AccountStack = StackNavigator(
	{
		Switch: { 
			//This is a "switch". If user is logged in, the account view is loaded
			//Else, the signin/up view is loaded. It works. DON'T touch it.
			screen: Switch,
			navigationOptions: ({navigation, screenProps})=>{
				return {
					header: (headerProps)=>{
						return (<TitleBar
							navigation={navigation}
							screenProps={screenProps}
							headerProps={headerProps}
						/>);
					}
				};
			}
		},
		SignIn: { 
			screen: SignIn,
			navigationOptions: {
				title: "Sign In",
			}
		},
		AddBook: {
			screen: AddBook,
		},
		BookDetails: {
			screen: ConnectedBookDetails,
			navigationOptions: {
				title: "Book Details"
			}
		},
		ScanRoutine: {
			screen: ScanRoutine
		},
		SignUp: {
			screen: SignUpForm,
			navigationOptions: {
				title: "Sign Up",
			}
		}
	},
);
export default AccountStack;
//Now only need to work on AccountTabNav.
//styles for the header bar
