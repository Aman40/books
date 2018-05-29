
//The Switch component. If the user is logged in, it returns the <Account/> component.
//Else, it returns the signup/signin promper view

import React, {Component} from "react";
import AccountTabNav from "./ac_tabnav";
import store from "../store";
import SignUpIn from "./ac_signupin";
//import {objectToString} from "../shared_components/shared_utilities";
import {connect, Provider} from "react-redux";

class _Switch extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		console.log(this.props.isLoggedIn?"Switch. Logged in":"Switch. Not logged in");
		if(this.props.isLoggedIn) {
			return (<AccountTabNav
				navigation={this.props.navigation}
			/>);
		} else {
			return (<SignUpIn
				navigation={this.props.navigation}
			/>);
		}
	}
}
//Define mapStateToProps. 
function mapStateToProps(state) {
	return {
		isLoggedIn: state.session.isLoggedIn,
	};
}
//Connect
const ConnectedSwitch = connect(mapStateToProps,{})(_Switch);
//Provide and export
export default class Switch extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<ConnectedSwitch
					navigation={this.props.navigation}
				/>
			</Provider>
		);
	}
}
//Wire the AccountTabNav router to the mother router
Switch.router = AccountTabNav.router;
//TODO: Check if AccountTabNav receives navigation
//props from both TabNavigation and its parent 
//StackNavigation.