

let getParam = (params, property, defaultValue ) => {
    if(params.hasOwnProperty(property) && params[property] !== undefined){
		return params[property];
	}
	return defaultValue;
}

let getParamOrder = (params, property, defaultValue ) => {
	if(params.hasOwnProperty(property) && params[property] !== undefined){
	return params[property];
}
return defaultValue;
}

module.exports = {
    getParam,
		getParamOrder
}