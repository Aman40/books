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
import Switch from "./ac_switch";
import TitleBar from "./titlebar";
import ScanScreen from "./barcode_scanner";
import AddBook from "./add_book";
import ScanPreview from "./scanned_preview";

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
		BarcodeScanner: {
			screen: ScanScreen,
			navigationOptions: {
				//todo
			}
		},
		AddBook: {
			screen: AddBook,
		},
		ScanPreview: {
			screen: ScanPreview,
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
		}
	},
);
export default AccountStack;
//Now only need to work on AccountTabNav.
//styles for the header bar
