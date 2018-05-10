import React, {Component} from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
} from "react-native";
import {StackNavigator} from "react-navigation";
import SignIn from "./view_signin";


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
import AccountTabNav from "./ac_tabnav";

class _Switch extends Component {
	render() {
		let selected_component = "";
		console.log(`isLoggedIn? ${this.props.isLoggedIn}`);
		console.log(Object.getOwnPropertyNames(this.props.session).toString());
		if(this.props.isLoggedIn) {
			selected_component = <AccountTabNav navigation={this.props.navigation} />;
		} else {
			selected_component = <SignUpIn navigation={this.props.navigation} />;
		}
		return selected_component;
	}
}
//Connect the switch to the store
import store from "../store";
import {connect, Provider} from "react-redux";

function mapStateToProps(state) {
	console.log(Object.getOwnPropertyNames(state).toString());
	return {
		session: state.session,
	};
}
function mapDispatchToProps(dispatch) {
	return {dispatch};
}

let ConnectedSwitch = connect(
	mapStateToProps,
	mapDispatchToProps
)(_Switch);

class Switch extends Component {
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

export default AccountStack = StackNavigator(
	{
		AccountHome: {
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
