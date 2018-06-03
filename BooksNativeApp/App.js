/*
*The Adam of the app, if you wish
*/
import React, { Component } from "react";
import {View} from "react-native";
import MainTabNav from "./src/js/main_nav";
import GenericMsgDisplay from "./src/js/shared_components/err_msg_display_modal";

export default class App extends Component {
	render() {
		console.log("Rendered!");
		return (
			<View style={{
				flex: 1,
				width: "100%"
			}}>
				<GenericMsgDisplay/>
				<MainTabNav/>
			</View>
		);
	}
}
