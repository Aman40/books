import {
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableWithoutFeedback,
	Image,
	TouchableOpacity,
} from "react-native";
import React, {Component} from "react";
import {
	connect,
	Provider,
} from "react-redux";
import store from "../store";
import {
	hideScanPreview,
} from "./ac_dispatchers";
import univ_const from "/var/www/html/books/BooksNativeApp/univ_const.json";
//import { objectToString } from "../shared_components/shared_utilities";
const host = univ_const.server_url;

class _ScanPreview extends Component {
	constructor(props) {
		super(props);
	}

	closeModal = ()=>{
		this.props.hideScanPreview();
	}
	
	render() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={true}
				onRequestClose={this.closeModal}
			>
				<TouchableWithoutFeedback>
					<View style={styles.wrapper}>
						<View style={styles.summary}>
							<View style={styles.bk_imageWrapper}>
								<Image
									resizeMode={"contain"}
									style={styles.bk_image}
									source={{uri: (()=>{
										return this.props.book.imageLinks?this.props.book.imageLinks.thumbnail:`${host}/images/placeholder.jpg`;
									})()}}
								/>
							</View>
							<View style={styles.bk_contentWrapper}>
								<View style={styles.bk_contentRow}>
									< Text style = {
										{ 
											...StyleSheet.flatten(styles.bk_title),
											color: "black"
										}
									} >
										{this.props.book.title}
									</Text>
									<Text style={styles.bk_contentValue}>
										by: {this.props.book.authors.toString()}
									</Text>
									<Text style={styles.bk_contentValue}>
										{this.props.book.language==="en"?"English":"Japanese"}
									</Text>
									<Text style = {
										{ 
											...StyleSheet.flatten(styles.bk_title),
											color: "black"
										}
									} >
										{this.props.book.hasOwnProperty("binding")?this.props.book.binding:"Unknown"}
									</Text>

									<Text style={styles.bk_contentValue}>
										{"Pages: "+this.props.book.pageCount}
									</Text>
								</View>
							</View>
						</View>


						<View style={styles.details}>
							<View style={styles.bk_contentWrapper}>
								{ /*Other details*/ }
								<View style={styles.bk_row}>
									<View style={styles.bk_head}>
										<Text style={styles.bk_headText}>Edition: </Text>
									</View>
									<View style={styles.bk_value}>
										<Text style={styles.bk_valueText}>
											{this.props.book.edition}
										</Text>
									</View>
								</View>

								<View style={styles.bk_row}>
									<View style={styles.bk_head}>
										<Text style={styles.bk_headText}>Language: </Text>
									</View>
									<View style={styles.bk_value}>
										<Text style={styles.bk_valueText}>
											{this.props.book.language==="en"?"English":"Japanese"}
										</Text>
									</View>
								</View>

								<View style={styles.bk_row}>
									<View style={styles.bk_head}>
										<Text style={styles.bk_headText}>Number of Pages: </Text>
									</View>
									<View style={styles.bk_value}>
										<Text style={styles.bk_valueText}>
											{this.props.book.pageCount}
										</Text>
									</View>
								</View>

								<View style={styles.bk_row}>
									<View style={styles.bk_head}>
										<Text style={styles.bk_headText}>Publisher: </Text>
									</View>
									<View style={styles.bk_value}>
										<Text style={styles.bk_valueText}>
											{this.props.book.hasOwnProperty("publisher")?this.props.book.publisher:"Unknown"}
										</Text>
									</View>
								</View>

								<View style={styles.bk_row}>
									<View style={styles.bk_head}>
										<Text style={styles.bk_headText}>Published: </Text>
									</View>
									<View style={styles.bk_value}>
										<Text style={styles.bk_valueText}>
											{this.props.book.published}
										</Text>
									</View>
								</View>

								<View style={styles.bk_row}>
									<View style={styles.bk_head}>
										<Text style={styles.bk_headText}>Description: </Text>
									</View>
									<View style={styles.bk_value}>
										<Text style={styles.bk_valueText}>
											{this.props.book.description}
										</Text>
									</View>
								</View>

							</View>
						</View>
						<TouchableOpacity
							style={styles.buttonTouchable}
							onPress={this.closeModal}
						>
							<Text style={styles.buttonText}>OK. Continue.</Text>
						</TouchableOpacity>
					</View>
				</TouchableWithoutFeedback>
				
			</Modal>	
		);
	}
}
function mapStateToProps(state) {
	return {
		show: state.guiControl.showScanPreview,
		book: state.booksToAdd.addedBooksList[state.booksToAdd.addedBooksList.length-1],
	};
}

function mapDispatchToProps(dispatch) {
	return {
		hideScanPreview: ()=>{
			hideScanPreview(dispatch); //If show:false, also reactivate the scanner.
		},
	};
}
const ConnectedScanPreview = connect(
	mapStateToProps,
	mapDispatchToProps
)(_ScanPreview);

export default class ScanPreview extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<ConnectedScanPreview />
			</Provider>
		);
	}
}

const styles = StyleSheet.create({
	summary: {
		flex: 1,
	},
	details: {
		flex: 1,
		backgroundColor: "#AAA"
	},
	text: {
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
	},
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "stretch",
		backgroundColor: "#FEFEFE",
	},
	scrollview: {
		flex: 1,
	},
	bk_wrapper: {
		height: 144,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "stretch",
	},
	bk_imageWrapper: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "flex-start",
		backgroundColor: "white",
	},
	bk_image: {
		flex: 1,
		width: "100%",
		height: 400,
	},
	bk_contentWrapper: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	bk_contentRow: {
		flex: 1,
	},
	bk_contentLabel: {

	},
	bk_title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	bk_contentValue: {

	},
	wrapper: {
		flex: 1,
		width: "100%",
		padding: 5,
		paddingHorizontal: 5,
		alignItems: "center",
		backgroundColor: "white",
	},
	location: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	owner: {

	},
	head: {
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	imageWrapper: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
	},
	image: {
		flex: 1,
		width: "100%",
		height: 400,
	},
	bk_row: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	bk_head: {
		flex: 1,
	},
	bk_headText: {
		color: "#111",
		fontWeight: "bold",
	},
	bk_value: {
		flex: 4,
	},
	bk_valueText: {
		color: "#222",
	},
	buttonText: {
		fontSize: 21,
		color: "rgb(0,122,255)",
	},
	buttonTouchable: {
		padding: 16,
	},
});