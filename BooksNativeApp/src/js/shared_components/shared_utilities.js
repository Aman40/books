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
	return returnString+=`${arr[arr.length-1]}=${Obj[arr[arr.length-1]]}`; //The comma at the end
}