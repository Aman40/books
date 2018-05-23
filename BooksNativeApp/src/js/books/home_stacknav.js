//This modules imports all the
import {StackNavigator} from "react-navigation";
import React from "react";
import ConnectedBooksView from "./books_connector";
import ConnectedBookDetails from "./book_details";
import TitleBar from "./books_titlebar";
//import { objectToString } from "../shared_components/shared_utilities";

const BookDetailsStack = StackNavigator(
	{
		Home: {
			screen: ConnectedBooksView,
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
);
export default BookDetailsStack;
/*
 * Create a header for the stack navigator.
 */