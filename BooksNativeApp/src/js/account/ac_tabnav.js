import {
	View,
	Text,
	StyleSheet
} from "react-native";
import React, {Component} from "react";
import {
	Tabnavigator
} from "react-navigation";
import MyBooks from "./my_books";
import MyPastPapers from "./my_pastpapers";
import MyProfile from "./my_profile";

export /*To ac_stacknav.js*/ default class AccountTabNav extends Component { 
	render() {
		//TODO: Finish this.
		return (
			<View style={styles.wrapper}>
				<Text style={styles.text}>
                    Hello, this will be the stack navigation.
					If you are seeing this, it means you are logged in.
                    Youll be able to select between:
                    1. MyBooks
                    2. MyPastPapers
                    3. MyProfile
				</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create(
	{
		wrapper: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		text: {
			color: "gray"
		}
	}
);