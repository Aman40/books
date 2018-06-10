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
	Button,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Carousel from "react-native-looped-carousel";
import {objectToString} from "../shared_components/shared_utilities";
import univ_const from "../../../univ_const.json";
const host = univ_const.server_url;

class _BookDetails extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		console.log(objectToString(this.props.book.images[0]));
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
									{this.props.book.Language}
								</Text>
							</View>
						</View>

						<View style={styles.bk_row}>
							<View style={styles.bk_head}>
								<Text style={styles.bk_headText}>Cover: </Text>
							</View>
							<View style={styles.bk_value}>
								<Text style={styles.bk_valueText}>
									{this.props.book.Cover}
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
					<View>
						{/*Claim it controls.*/}
						<Button
							onPress={()=>console.log("You can have it!")}
							title={"Request"}
							color={"#BADA55"}
							accessibilityLabel={"Request for this book"}
						/>
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
	},
	bk_value: {
		flex: 4,
	},
	bk_valueText: {
		color: "#222",
	}
});

//connect it.
function mapStateToProps(state) {
	return {
		book: state.guiControl.searchMode?
			state.books.searchResultsArr[state.books.clickedOn]:
			state.books.booksArr[state.books.clickedOn],
	};
}
function mapDispatchToProps(dispatch) {
	return ({
		check: ()=>{
			console.log("It's dispatching!");
			dispatch({
				type: "TESTING",
				payload: "This is temporary"
			});
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
