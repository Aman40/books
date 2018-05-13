import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";
import {StackNavigator} from "react-navigation";
import SignIn from "./view_signin";
import store from "../store";
import AccountTabNav from "./ac_tabnav";


class SignUpIn extends Component {
	constructor(props) {
		super(props);
	}
	navigateToSignUp = ()=>{
		this.props.navigation.navigate("SignUp");
	}
	navigateToSignIn = ()=>{
		this.props.navigation.navigate("SignIn");
	}
	render() {
		return (
			<View style={styles.wrapper}>
				<TouchableOpacity
					accessibilityComponentType="button"
					style = {
						{
							width: "80%",
							flexDirection: "row",
							marginBottom: 10,
						}
					}
				>
					<View style={styles.upBtn}>
						<Text style={styles.btnText}>
							Sign Up
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={this.navigateToSignIn}
					accessibilityComponentType="button"
					style={{width: "80%", flexDirection: "row"}}
				>
					<View style={styles.upBtn}>
						<Text style={styles.btnText}>
							Sign In
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}
//Define the switch. If the user is logged in, it returns the <Account/> component.
//Else, it returns the signup/signin promper view

//let Switch = SignUpIn;
//let isLoggedIn = store.getState().session.isLoggedIn;
class Switch extends Component {
	componentDidMount = ()=>{
		let that = this;
		store.subscribe(()=>{
			console.log("STORE CHANGED!");
			if(store.getState().session.isLoggedIn) {
				that.render();
			}
		});
	}
	render() {
		let isLoggedIn = store.getState().session.isLoggedIn;
		if(isLoggedIn) {
			return <AccountTabNav/>;
		} else {
			return SignUpIn;
		}
	}
}

let AccountStack = StackNavigator(
	{
		AccountHome: { 
			//This is a "switch". If user is logged in, the account view is loaded
			//Else, the signin/up view is loaded. It works. DON'T touch it.
			screen: Switch,
			navigationOptions: {
				title: "Account"
			}
		},
		SignIn: { 
			screen: SignIn,
			navigationOptions: {
				title: "Sign In",
			}
		}
	},
	{
		initialRouteName: ""
	}
);
export default AccountStack;

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: 400,
		justifyContent: "center",
		alignItems: "center",
	},
	text: {

	},
	btnText: {
		fontSize: 18,
		color: "white",
	},
	upBtn: {
		flex: 1,
		backgroundColor: "#007AFF",
		elevation: 4,
		paddingHorizontal: 5,
		paddingVertical: 5,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5
	},
	inBtn: {
		width: 100,
	}
});
//Now only need to work on AccountTabNav.