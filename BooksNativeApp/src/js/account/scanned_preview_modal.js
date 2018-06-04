import {
	View,
	Text,
	StyleSheet,
	Modal,
	Image,
	ScrollView,
	TouchableOpacity,
	ImageBackground
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
				<View style={styles.wrapper}>
					<ImageBackground 
						style={styles.bgImage}
						resizeMode={"cover"}
						source={{uri: (()=>{
							return this.props.book.imageLinks?this.props.book.imageLinks.thumbnail:`${host}/images/placeholder.jpg`;
						})()}}
					>
						<View style={styles.content}>
							<View style={styles.bk_imageWrapper}>
								<Image
									resizeMode={"contain"}
									style={styles.bk_image}
									source={{uri: (()=>{
										return this.props.book.imageLinks?this.props.book.imageLinks.thumbnail:`${host}/images/placeholder.jpg`;
									})()}}
								/>
							</View>

							<View style={styles.details}>
								<ScrollView style={{flex: 1}}>
									<View style={styles.bk_contentRow}>
										< Text style = {
											{ 
												...StyleSheet.flatten(styles.bk_title),
												color: "black"
											}
										} >
											{this.props.book.title}
										</Text>
										<Text>
									By: <Text style = {{
												...StyleSheet.flatten(styles.bk_contentValue),
												color: "blue",
											}} >
												{this.props.book.authors.toString()}
											</Text>
										</Text>
								
										<Text style={styles.bk_contentValue}>
											{this.props.book.language==="en"?"English":"Japanese"}
										</Text>
										<Text style = {
											{ 
												color: "black"
											}
										} >
											{this.props.book.hasOwnProperty("binding")?this.props.book.binding:""}
										</Text>
									</View>
									<View style={styles.bk_contentWrapper}>
										{ /*Other details*/ }
										<View style={styles.bk_row}>
											<View style={styles.bk_head}>
												<Text style={styles.bk_headText}>#Pages: </Text>
											</View>
											<View style={styles.bk_value}>
												<Text style={styles.bk_valueText}>
													{"Pages: "+this.props.book.pageCount?this.props.book.pageCount:""}
												</Text>
											</View>
										</View>

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
												<Text style={styles.bk_headText}>Publisher: </Text>
											</View>
											<View style={styles.bk_value}>
												<Text style={styles.bk_valueText}>
													{this.props.book.hasOwnProperty("publisher")?this.props.book.publisher:""}
												</Text>
											</View>
										</View>

										<View style={styles.bk_row}>
											<View style={styles.bk_head}>
												<Text style={styles.bk_headText}>Published: </Text>
											</View>
											<View style={styles.bk_value}>
												<Text style={styles.bk_valueText}>
													{this.props.book.publishedDate}
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
								</ScrollView>	
							</View>
						</View>
						
						<TouchableOpacity
							style={styles.buttonTouchable}
							onPress={this.closeModal}
						>
							<Text style={styles.buttonText}>Continue.</Text>
						</TouchableOpacity>
					</ImageBackground>	
				</View>
							
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
	bk_imageWrapper: {
		flex: 2,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "flex-start",
	},
	bk_image: {
		flex: 1,
		height: "100%",
		width: "auto",
	},
	details: {
		flex: 3,
		paddingTop: 10,
		backgroundColor: "rgba(220,220,220,0.5)",
	},
	scrollview: {
		flex: 1,
	},
	bk_title: {
		fontSize: 18,
		fontWeight: "bold",
	},
	bk_contentValue: {

	},
	wrapper: {
		flex: 1,
		width: "100%",
		alignItems: "stretch",
		backgroundColor: "#777"
	},
	bgImage: {
		flex: 1,
	},
	location: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	head: {
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	imageWrapper: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
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
		flex: 3,
	},
	bk_valueText: {
	},
	buttonText: {
		fontSize: 21,
		color: "rgb(0,122,255)",
	},
	content: {
		flex: 11,
		backgroundColor: "rgba(240,240,240,0.8)",
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	buttonTouchable: {
		flex: 1,
		padding: 8,
		backgroundColor: "rgba(240,240,240,0.8)",
	},
});