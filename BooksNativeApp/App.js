/*
*The Adam of the app, if you wish
*/
import React, { Component } from "react";
import {View} from "react-native";
import MainTabNav from "./src/js/main_nav";

export default class App extends Component {
	render() {
		console.log("Rendered!");
		return (
			<View style={{
				flex: 1,
				width: "100%"
			}}>
				<MainTabNav/>
			</View>
		);
	}
}
