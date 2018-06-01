import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from "react-native";
import React, {Component} from "react";
import {
	connect,
	Provider,
} from "react-redux";
import store from "../store";
import {
	showAccountMenu, //Not really necessary
	hideAccountMenu,
	logout,

} from "./ac_dispatchers";

class _Menu extends Component {
	constructor(props) {
		super(props);
	}

	closeModal = ()=>{
		this.props.hideAccountMenu();
	}
	logout = ()=>{
		this.props.hideAccountMenu();
		this.props.logout();
	}
	render() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={true}
				onRequestClose={this.closeModal}
			>
				<TouchableWithoutFeedback
					onPress = {this.closeModal}
				>
					<View
						style={styles.touchable}
					>
						<View style={styles.menu}>
							<TouchableOpacity
								onPress={this.logout}
							>
								<View style={styles.menuitem}>
									<Text>
									Log Out
									</Text>
								</View>
							</TouchableOpacity>

							<TouchableOpacity>
								<View style={styles.menuitem}>
									<Text>
									Settings
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					
				</TouchableWithoutFeedback>
				
			</Modal>	
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
		hideAccountMenu: ()=>{
			hideAccountMenu(dispatch);
		},
		logout: ()=>{
			logout(dispatch);
		}
	};
}
const ConnectedMenu = connect(
	mapStateToProps,
	mapDispatchToProps
)(_Menu);

export default class Menu extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<ConnectedMenu />
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	text: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	},
	menu: {
		width: 180,
		position: "absolute",
		top: 56,
		right: 20,
		backgroundColor: "#EEE",
		zIndex: 10,
		elevation: 10,
	},
	menuitem: {
		flex: 1,
		height: 48,
		justifyContent: "center",
		alignItems: "center",
	},
	menu_item_text: {
		color: "gray",
	},
	touchable: {
		flex: 1,
		width: "100%",
	}
});