/*jshint esversion: 6 */
import React, {Component} from "react";
import {connect, Provider} from "react-redux";
import store from "../store";
import {
	StyleSheet,
	View,
	Text,
	ScrollView,
	Image,
	TouchableOpacity,
} from "react-native";
import { deleteBooks, pullDatabaseChanges } from "./ac_dispatchers";
import Ionicons from "react-native-vector-icons/Ionicons";
import Carousel from "react-native-looped-carousel";
import { langISO6391 } from "../shared_components/shared_utilities";
// import {objectToString} from "../shared_components/shared_utilities";
import univ_const from "../../../univ_const.json";
const host = univ_const.server_url;

class _BookDetails extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		// console.log(objectToString(this.props.book));
		return (
			<ScrollView>
				<View style={styles.wrapper}>
					< View style = {
						{ 
							...StyleSheet.flatten(styles.location),
							paddingHorizontal: 10,
						}
					} >
						{/*Location*/}
						<View style={{
							flex: 1,
							paddingHorizontal: 10,
						}}>
							<Ionicons
								name={"md-locate"}
								size={25}
								color="gray"
							/>
							{/*for the location icon*/}
						</View>
						<View style={{
							flex: 4,
						}}>
							{/*Location text*/}
							<Text>
								{this.props.book.Location}
							</Text>
						</View>
					</View>

					<View style={styles.owner}>
						{/*Owner*/}
						<Text style={{color: "#333"}}>
							By: <Text style={{color: "blue"}}>
								{this.props.book.UserID}
							</Text>
						</Text>
					</View>

					<View style={styles.head}>
						{/*Owner*/}
						< Text style = {
							{
								fontSize: 20,
								color: "black",
								fontWeight: "bold",
							}
						} >
							{this.props.book.Title}
						</Text>
					</View>

					<View
						style={{
							height: 400,
							width: "100%",
						}}
					>
						{/*Image Carousel*/}
						<Carousel
							style={{
								flex: 1,
							}}
							delay={2000}
							autoplay={true}
							pageInfo
						>
							{
								(()=>{
									let carouselImgs = [];
									for(let i = 0; i<this.props.book.images;i++){
										carouselImgs.push(
											<View key={this.props.book.images[i].ImgID} 
												style={styles.imageWrapper}>
												<Image 
													source={{uri: `${host}/images/${this.props.book.images[i].ImgID}.jpeg`}}
													style={styles.image}
													resizeMode={"contain"}
												/>
											</View>
										);
									}
									if(this.props.book.Thumbnail) {
										carouselImgs.push(
											<View key={"thumbnail"} style={styles.imageWrapper}>
												<Image 
													source={{uri: this.props.book.Thumbnail.replace(/^http:/,"https:")}}
													style={styles.image}
													resizeMode={"contain"}
												/>
											</View>
										);
									}
									if(!carouselImgs.length){
										carouselImgs.push(
											<View key={"default"} style={styles.imageWrapper}>
												<Image 
													source={{uri: `${host}/images/placeholder.jpg`}}
													style={styles.image}
													resizeMode={"contain"}
												/>
											</View>
										);
									}
									return carouselImgs;
								})()
							}
							
						
						</Carousel>
					</View>

					<View>
						{/*Price*/}
						<Text style={{color: "#333", fontSize: 18}}>
							Price: JPY <Text style={{color: "red", fontSize: 18}}>
								{this.props.book.Price}
							</Text>
						</Text>
					</View>

					<View style={styles.availability}>
						{/*Availability*/}
						<Text>{this.props.book.availability}</Text>
					</View>

					<View style={styles.bk_contentWrapper}>
						{ /*Other details*/ }
						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Edition: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.Edition}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Language: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{langISO6391[this.props.book.Language]}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Cover: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.Binding}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Pages: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.NoPages}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Publisher: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.Publisher}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Published: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.Published}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>ISBN: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.ISBN}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Condition: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.Condition}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Delivery: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.Delivery}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Added: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.DateAdded}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Availability: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.OfferExipiry}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Description: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.Description}
								</Text>
							</View>
						</View>
					</View>
					<View style={styles.controls}>
						{/*Claim it controls.*/}
						<TouchableOpacity
							style={{
								elevation: 5
							}}
							onPress={()=>console.log("Wanna edit, huh?")}>
							<View
								style={styles.controlButton}>
								<Text style={styles.btnText}>
									Edit
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							style={{
								elevation: 5
							}}
							onPress={()=>{
								// console.log("Deleting: "+this.props.book.BookID);
								this.props.deleteBooks([this.props.book.BookID], (success)=>{
									console.log(success?"Deleted":"NOT Deleted");
									console.log("Done! This is the callback");
									//Go back and refresh.
									this.props.navigation.goBack();
									//Dispatch a change action to the store
									this.props.pullDbChanges();
									//myBooks, upon detecting the change should refresh
								}); //Put the bookId[ and callback]
							}}>
							<View
								style={styles.controlButton}>
								<Text style={styles.btnText}>
									Delete
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
			
		);
	}
}
const styles = StyleSheet.create({
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
	bk_contentWrapper: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
		borderRadius: 5,
		paddingHorizontal: 5,
		backgroundColor: "black"
	},
	bk_row: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		height: 42,
	},
	bk_head: {
		flex: 2,
	},
	bk_headText: {
		color: "orange",
	},
	bk_value: {
		flex: 4,
	},
	bk_valueText: {
		color: "white",
	},
	controls: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		height: 40,
	},
	controlButton: {
		width: 80,
		height: 30,
		backgroundColor: "teal",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
	},
	btnText: {
		color: "white",
	}
});

//connect it.
function mapStateToProps(state) {
	// console.log(JSON.stringify(state.myBooks.booksArr[state.myBooks.clickedOn]));
	return {
		book: state.myBooks.booksArr[state.myBooks.clickedOn],
		deleteBookStatus: state.deleteBooks,
	};
}
function mapDispatchToProps(dispatch) {
	return ({
		deleteBooks: (book_ids, callback)=>{
			deleteBooks(dispatch, book_ids, callback);
		},
		pullDbChanges: ()=>{
			pullDatabaseChanges(dispatch);
		}
	});
}
const _ConnectedBookDetails = connect(mapStateToProps, mapDispatchToProps)(_BookDetails);

export default class ConnectedBookDetails extends Component {
	render() {
		return (
			<Provider
				store={store}
			>
				<_ConnectedBookDetails
					navigation={this.props.navigation}
				/>
			</Provider>
		);
	}
}
//Props from the store are passed directly to _ConnectedBookDetails by Provider from the store. Those from navigator have to be passed manually
