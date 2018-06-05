export function objectToString(Obj) {
	/*return value: [string] "property1=<type1>value1, property2=<type2>value2[, ..."
		* The req.session.cookie object doesn't have a toString() method
		* So I'm making my own generic one. It doesn't make prior assumptions
		* about the properties of the object. It, however, only returns a
		* string of enum()-able properties and their values
	* */
	if(!Obj) return "Not an object: Null or undefined.";
	let arr = Object.getOwnPropertyNames(Obj); //Get all the properties
	let returnString = "";
	for(let i=0;i<arr.length-1; i++) {
		returnString+=`${arr[i]}<${typeof(Obj[arr[i]])}> => ${Obj[arr[i]]}, `;	
	}
	return returnString+=`${arr[arr.length-1]}<${typeof(Obj[arr[arr.length-1]])}> =>${Obj[arr[arr.length-1]]}`; //The comma at the end
}
function getCurrDate() {
	let date = new Date();
	//YYYY:MM:DD HH:MM:SS Unix datetime string, mysql compatible
	let month = date.getMonth();
	month++; //Javascript month is 0 based. 0=January, 11=December
	if(month<10) {
		month="0"+month.toString();
	}
	let day = date.getDate();
	if(day<10) {
		day="0"+day.toString();
	}
	let hours = date.getHours();
	if(hours<10) {
		hours="0"+hours.toString();
	}
	let minutes = date.getMinutes();
	if(minutes<10) {
		minutes="0"+minutes.toString();
	}
	let seconds = date.getSeconds();
	if(seconds<10) {
		seconds="0"+seconds.toString();
	}
	return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
