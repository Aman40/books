import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Image,
} from "react-native";
import {
	connect,
	Provider,
} from "react-redux";
import store from "../store";
import React, {Component} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
	showAccountMenu,
} from "./ac_dispatchers";
import Menu from "./account_menu";
import univ_const from "../../../univ_const";

class _TitleBar extends Component {
	constructor(props){
		super(props);
	}
	showMenu = ()=>{
		this.props.showAccountMenu();
	}
	render() {
		let menu;
		console.log(this.props.show?"Showing":"Hidden");
		if(this.props.show) {
			menu=<Menu/>;
		}

		return (
			<View style={styles.wrapper}>
				<View style={styles.left}>
					<Image
						style={styles.logo}
						resizeMode={"contain"}
						source={require("../../../books-logo.png")}
					/>
				</View>
				
				<View style={styles.center}>
					<Text style={styles.text}>
						Center component
					</Text>
				</View>

				<TouchableOpacity
					style={styles.right}
					onPress={this.showMenu}
				>
					<View>
						<Ionicons
							name={"md-menu"}
							size={25}
							color="black"
						/>
						{menu}
					</View>
					
				</TouchableOpacity>

			</View>
		);
	}
}
function mapStateToProps(state) {
	return {
		show: state.guiControl.showAccountHeaderMenu,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		showAccountMenu: ()=>{
			showAccountMenu(dispatch);
		},
	};
}
const ConnectedTitleBar = connect(
	mapStateToProps,
	mapDispatchToProps
)(_TitleBar);
export default class TitleBar extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<ConnectedTitleBar/>
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	logo: {
		flex: 1,
		height: 56,
	},
	wrapper: {
		alignSelf: "center",
		height: 56,
		backgroundColor: univ_const.alt_theme_color,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "stretch"
	},
	left: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	center: {
		flex: 4,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	right: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
	},
	text: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	},
});