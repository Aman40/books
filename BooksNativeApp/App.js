/*
*The Adam of the app, if you wish
*/
import React, { Component } from "react";
import MainTabNav from "./src/js/main_nav";

export default class App extends Component {
	componentDidMount = ()=>{
		
	}
	render() {
		console.log("Rendered!");
		return (
			<MainTabNav/>
		);
	}
}
