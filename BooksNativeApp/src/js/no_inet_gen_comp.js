/**
 * No internet access generic component
 * This is what's displayed when there's no internet
 * The component will be self contained somewhat with all its dispatchers,
 * actions, mappers from state and dispatch to props, and styles.
 */
import React, {Component} from "react";
import {
	Text,
	StyleSheet,
	View,
	RefreshControl,
	ScrollView
} from "react-native";
import { createSession } from "./account/ac_dispatchers";
import { connect, Provider } from "react-redux";
import store from "./store";
import { START_UP } from "./account/ac_dispatchers";

const actions = {
	STARTED_REFRESHING: "started checking internet status",
	ERROR_REFRESHING: "still no internet",
	SUCCESS_REFRESHING: "internet restored"
};
module.exports.actions = actions;

class _NoInternet extends Component {
	componentDidMount=()=>{
		console.log("The component mounted");
	}
	_onRefresh = ()=>{
		//Try to check if user is logged in. We already have that code somewhere
		//Ctrl+C Ctrl+V
		this.props.attemptLogin();
	}
	render(){
		console.log("Attempting to render");
		return (
			<View style={styles.wrapper}>
				<ScrollView
					refreshControl={
						<RefreshControl
							refreshing={this.props.retrying}
							onRefresh={this._onRefresh}
						/>
					}
					style={styles.scrollview}
				>
					<View style={styles.container}>
						<View style={styles.content}>
							<View style={styles.animation}>
								{/*Perhaps an image of crying kitty? But animated?*/}
								<Text>:(</Text>
							</View>
							<View style={styles.message}>
								<Text style={styles.msgText}>
								Oops! Looks like you have no internet access 
								</Text>
								<Text style={styles.msgText}>
								Pull down to refresh
								</Text>
								<Text style={styles.msgText}>
								if you think you have fixed
								the problem.
								</Text>
							</View>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	wrapper: {
		height: "100%",
	},
	scrollview: {
		flexDirection: "column",
		flex: 1,
	},
	container: {
		height: "100%",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
	},
	content: {
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},
	animation: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	message: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	msgText: {
		fontSize: 14,
		justifyContent: "center",
	}
});

function mapStateToProps(state) {
	return {
		retrying: state.session.loginWait,
	};
}
function mapDispatchToProps(dispatch) {
	return {
		/**
		 * By attempting to log in, we get the following pieces of information:
		 * 1. Are we connected to the internet?
		 * 2. Are we logged in?
		 * And that's all we need to determine whether or not to display this component.
		 * The results of the attempt needn't be processed here. That should happen
		 * in Switch
		 */
		attemptLogin: ()=>createSession({
			type: START_UP, //Change this in future to include failed requests.
			//Get value from store.
		}, dispatch),
	};
}
const ConnectedNoInternet = connect(
	mapStateToProps,
	mapDispatchToProps
)(_NoInternet);

export default class NoInternet extends Component {
	render(){
		return (
			<Provider
				store={store}
			>
				<ConnectedNoInternet
					navigation={this.props.navigation}
				/>
			</Provider>
		);
	}
}


