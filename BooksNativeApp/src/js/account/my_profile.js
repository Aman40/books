import React, {Component} from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView
} from "react-native";
import {connect, Provider} from "react-redux";
import store from "../store";
import {objectToString} from "../shared_components/shared_utilities";

class _MyProfile /*to ac_tabnav.js*/ extends Component {
	render() {
		console.log(objectToString(this.props.userData));
		return (
			<View style={styles.wrapper}>
				<View style={styles.statsBar}>
					<View style={styles.num_books}>
						<Text>
							#books
						</Text>
					</View>
					<View style={styles.num_papers}>
						<Text>
							#papers
						</Text>
					</View>
					<View style={styles.num_notifs}>
						<Text>
							#notifs
						</Text>
					</View>
				</View>

				<ScrollView>
					<View style={styles.scroll}>
						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text>
								Alias:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text>
									{this.props.userData.alias}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text>
									Sex:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text>
									{this.props.userData.sex}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text>
									DoB:			
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text>
									{this.props.userData.dob}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text>
									Email:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text>
									{this.props.userData.email}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text>
									About:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text>
									{this.props.userData.about}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text>
									Student:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text>
									{this.props.userData.student?"Yes":"No"}
								</Text>
							</View>
						</View>

						<View style={styles.item}>
							<View style={styles.itemhead}>
								<Text>
									University:
								</Text>
							</View>
							<View style={styles.itemdata}>
								<Text>
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
		num_books: {
			flex: 1,
		},
		num_papers: {
			flex: 1,
		},
		num_notifs: {
			flex: 1,
		},
		scroll: {
			justifyContent: "flex-start",
			alignItems: "stretch",
			paddingHorizontal: 10,
		},
		item: {
			flexDirection: "row",
			height: 40,
		},
		itemhead: {
			flex: 1,
		},
		itemdata: {
			flex: 2,
		}
	}
);