import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
} from "react-native";

export default class MyBooks /*to ac_tabnav.js*/ extends Component {
	render() {
		return (
			<View style={styles.wrapper}>
				<Text style={styles.text}>
					Oh, hi Mark! MyBooks!
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
			color: "gray",

		}
	}
);