//The Switch component. If the user is logged in, it returns the <Account/> component.
//Else, it returns the signup/signin promper view
//Addition: When server access fails and there's no way to know whether user is loggid in or
//not, load a third component that simply declares lack of internet with the option to 
//pull down to refresh (and reload the switch)

import React, {Component} from "react";
import AccountTabNav from "./ac_tabnav";
import store from "../store";
import SignUpIn from "./ac_signupin";
//import {objectToString} from "../shared_components/shared_utilities";
import {connect, Provider} from "react-redux";
import NoInternet from "../no_inet_gen_comp";

class _Switch extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		console.log(this.props.isLoggedIn?"Switch. Logged in":"Switch. Not logged in");
		console.log("Has internet? "+this.props.hasInternet);
		if(this.props.isLoggedIn) {
			return (<AccountTabNav
				navigation={this.props.navigation}
			/>);
		} 
		else if(!this.props.hasInternet) {
			//If there's no internet
			return (
				<NoInternet navigation={this.props.navigation}/>
			);
		} 
		else {
			//There's internet but the user is not logged in.
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
		hasInternet: state.session.hasInternet,
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