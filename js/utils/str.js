"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// str
// script with a set of helper functions related to strings
(function ($, document, window) {

    // isScalar
	// retourne vrai si la valeur est scalar
	$.isScalar = function(value) 
	{
		return (/boolean|number|string/).test(typeof value);
	}


	// isString
	// retourne vrai si la valeur est une string
	$.isString = function(value) 
	{
		return ($.type(value) === 'string')? true:false;
	};
	
	
	// isStringNotEmpty
	// retourne vrai si la valeur est une string non vide
	$.isStringNotEmpty = function(value) 
	{
		return ($.isString(value) && value)? true:false;
	};
	
	
	// isStringStart
	// retourne vrai si la string commence par needle
	$.isStringStart = function(needle,value)
	{
		return ($.isString(needle) && $.isString(value))? (value.slice(0,needle.length) == needle):false;
	};
	
	
	// isStringEnd
	// retourne vrai si la string finit par needle
	$.isStringEnd = function(needle,value)
	{
		return ($.isString(needle) && $.isString(value))? (value.slice(-needle.length) == needle):false;
	};
	
	
	// ucfirst
	// met la première lettre de la string uppercase
	$.ucfirst = function(value)
	{
		return ($.isStringNotEmpty(value))? value.charAt(0).toUpperCase() + value.slice(1):null;
	}
	
	
	// lcfirst
	// met la première lettre de la string lowercase
	$.lcfirst = function(value)
	{
		return ($.isStringNotEmpty(value))? value.charAt(0).toLowerCase() + value.slice(1):null;
	}
	

	// first
	// split une string et retourne le premier élément du split
	$.first = function(value,delimiter)
	{
		var r = null;
		
		if($.isStringNotEmpty(value) && $.isStringNotEmpty(delimiter))
		{
			value = value.split(delimiter);
			if($.isStringNotEmpty(value[0]))
			r = value[0];
		}
		
		return r;
	}
    
}(jQuery, document, window));