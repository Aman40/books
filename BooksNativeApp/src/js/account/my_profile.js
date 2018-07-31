import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView
} from "react-native";
import {connect, Provider} from "react-redux";
import store from "../store";
//import {objectToString} from "../shared_components/shared_utilities";
import Ionicons from "react-native-vector-icons/Ionicons";

class _MyProfile /*to ac_tabnav.js*/ extends Component {
	render() {
		return (
			<View style={styles.wrapper}>
				<View style={styles.statsBar}>
					<View style={styles.num_books}>

					</View>
					<View style={styles.num_papers}>

					</View>
					<View style={styles.num_notifs}>
						<Ionicons
							name={"md-notifications"}
							size={28}
							color={"#333"}
						/>
					</View>
				</View>

				<ScrollView>
					<View style={styles.scroll}>
						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text style={styles.headtext}>
								Alias:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text style={styles.datatext}>
									{this.props.userData.alias}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text style={styles.headtext}>
									Sex:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text style={styles.datatext}>
									{this.props.userData.sex}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text style={styles.headtext}>
									DoB:			
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text style={styles.datatext}>
									{this.props.userData.dob}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text style={styles.headtext}>
									Email:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text style={styles.datatext}>
									{this.props.userData.email}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text style={styles.headtext}>
									About:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text style={styles.datatext}>
									{this.props.userData.about}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text style={styles.headtext}>
									Student:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text style={styles.datatext}>
									{this.props.userData.student?"Yes":"No"}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text style={styles.headtext}>
									University:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text style={styles.datatext}>
									{this.props.userData.school}
								</Text>
							</View>
						</View>
					</View>
				</ScrollView>
				
			</View>
		);
	}
}
//Connect and wrap
function mapStateToProps(state) {
	return {
		userData: state.session.userData,
	};
}
let ConnectedMyProfile = connect(mapStateToProps)(_MyProfile);

export default class MyProfile extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<ConnectedMyProfile
					navigator={this.props.navigator}
				/>
			</Provider>
		);
	}
}
const styles = StyleSheet.create(
	{
		wrapper: {
			flex: 1,
			justifyContent: "flex-start",
			alignItems: "stretch",
		},
		text: {
			color: "gray",
		},
		statsBar: {
			backgroundColor: "#eee",
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			height: 42
		},
		tbtext: {
			fontSize: 16,
		},
		num_books: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		num_papers: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		num_notifs: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		scroll: {
			justifyContent: "flex-start",
			alignItems: "stretch",
			paddingHorizontal: 10,
		},
		item: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			paddingVertical: 5,
			borderBottomWidth: 1,
			borderBottomColor: "#DDD",
		},
		itemhead: {
			flex: 1,
		},
		headtext: {
			color: "#F57900",
			fontWeight: "bold",
			fontSize: 14
		},
		itemdata: {
			flex: 2,
		},
		datatext: {
			color: "#777",
			fontSize: 14,
		}
	}
);