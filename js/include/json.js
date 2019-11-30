/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// json
// script with functions related to json
quid.json = new function() 
{    
    // instance
    var $inst = this;
    
    
    // encode
    // encode une valeur en json
    this.encode = function(value) 
    {
        return JSON.stringify(value);
    }
    
    
    // decode
    // decode une valeur à partir d'un json
    this.decode = function(value) 
    {
        return JSON.parse(value);
    }
};