/**
 * This is a generic modal that display different messages as just
 * plain text, warnings, or errors. 
 * Usage:
 * 1. Embed the component in App.js. (It renders itself or not
 * 		according to the state of the store)
 * 2. In whatever component that wants to use it, import the 
 * 		function showGenericMessageModal({type: enum("message",
 * 		 "warning", "error"), text: "text"})
 */
import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableWithoutFeedback,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import React, {Component} from "react";
import {
	connect,
	Provider,
} from "react-redux";
import store from "../store";
//import {objectToString} from "../shared_components/shared_utilities";

class _GenMsgDisp extends Component {
	render() {
		if(this.props.show) {
			return (
				<Modal
					animationType="fade"
					transparent={true}
					visible={true}
					onRequestClose={this.props.hideModal}
				>
					<TouchableWithoutFeedback onPress = {this.props.hideModal}>
						<View style={styles.touchable}>
							<View style={styles.container}>
								<ScrollView style={styles.scrollView}>
									<Text style={styles.msgText}>
										{this.props.text}
									</Text>
								</ScrollView>
								<View style={styles.btnContainer}>
									<TouchableOpacity
										onPress={this.props.hideModal}
									>
										<Text style={styles.ok}>OK</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>	
			);
		} else {
			return [];
		}
	}
}
function mapStateToProps(state) {
	return {
		show: state.guiControl.genericMessageModal.visible,
		type: state.guiControl.genericMessageModal.type,
		text: state.guiControl.genericMessageModal.text,
	};
}
//<Actions and dispatchers>
const genericErrorModalActions = {
	OPEN_GENERIC_ERROR: "show the error",
	CLOSE_GENERIC_ERROR: "close the error",
};
module.exports.genericErrorModalActions = genericErrorModalActions; //To reducers
export function showGenericMessageModal(payload) {
//payload={type: enum("message", "warning", "error"), text}
	store.dispatch({
		type: genericErrorModalActions.OPEN_GENERIC_ERROR,
		payload,
	});
}
function hideModal(dispatch) {
	dispatch({
		type: genericErrorModalActions.CLOSE_GENERIC_ERROR,
		payload: null,
	});
}
//<Actions and dispatchers/>
function mapDispatchToProps(dispatch) {
	return {
		hideModal: ()=>hideModal(dispatch),
	};
}
const ConnectedModal = connect(
	mapStateToProps,
	mapDispatchToProps
)(_GenMsgDisp); //Good luck understanding!

export default class GenericMsgDisplay extends Component {
	render() {
		return (
			<Provider store={store}>
				<ConnectedModal/>
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
		backgroundColor: "rgba(255,255,255,0.8)"
	},
	container: {
		width: "60%",
		height: 200,
		backgroundColor: "#222",
		zIndex: 10,
		elevation: 10,
		justifyContent: "center",
		alignItems: "stretch",
		borderColor: "teal",
		borderWidth: 3,
		borderRadius: 10,
	},
	scrollView: {
		flex: 4,
		width: "100%",
		backgroundColor: "#CCC",
	},
	msgText: {
		color: "grey",
	},
	errText: {
		color: "red",
	},
	warningText: {
		//TODO
	},
	btnContainer: {
		flex: 1,
		color: "teal",
	}
});