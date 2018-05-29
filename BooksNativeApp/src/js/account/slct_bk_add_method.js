/**
 * This is a modal menu that opens with options for
 * selecting a method to add books. Methods involve:
 * -Barcode
 * -Manual entry
 */
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
	showAddMethodSelectorMenu,
	hideAddMethodSelectorMenu,
} from "./ac_dispatchers";
import {withNavigation} from "react-navigation";
//import {objectToString} from "../shared_components/shared_utilities";

class _Menu extends Component {
	constructor(props) {
		super(props);
	}
	useBarcodeScanner=()=>{
		console.log("Using barcode scanner");
		this.props.closeMenu();
		this.props.navigation.navigate("BarcodeScanner");
	}
	useManual=()=>{
		console.log("Using Manual");
	}
	render() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={true}
				onRequestClose={this.props.closeMenu}
			>
				<TouchableWithoutFeedback
					onPress = {this.props.closeMenu}
				>
					<View
						style={styles.touchable}
					>
						<View style={styles.menu}>
							<TouchableOpacity
								onPress={this.useBarcodeScanner}
							>
								<View style={styles.menuitem}>
									<Text>
Barcode Scanner
									</Text>
								</View>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={this.useManual}
							>
								< View style = {{
									...StyleSheet.flatten(styles.menuitem),
									borderTopWidth: 1,
									borderTopColor: "#999",
								}} >
									<Text>
Manual input
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
		openMenu: ()=>showAddMethodSelectorMenu(dispatch),
		closeMenu: ()=>hideAddMethodSelectorMenu(dispatch),
	};
}
const ConnectedMenu = connect(
	mapStateToProps,
	mapDispatchToProps
)(withNavigation(_Menu)); //Good luck understanding!

export default class MethodSelectorMenu extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<ConnectedMenu/>
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
	touchable: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	menu: {
		width: 180,
		backgroundColor: "#EEE",
		zIndex: 10,
		elevation: 10,
		justifyContent: "center",
		alignItems: "stretch",
	},
	menuitem: {
		height: 48,
		justifyContent: "center",
		alignItems: "center",
	},
	menu_item_text: {
		color: "gray",
	},
});