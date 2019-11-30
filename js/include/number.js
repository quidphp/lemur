/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// number
// script with functions related to numbers
Quid.Number = new function() 
{   
    // instance
    var $inst = this;
    
    
    // is
    // retourne vrai si la valeur est un nombre
    this.is = function(value)
    {
        return $.isNumeric(value);
    }
    
    
    // isInt
    // retourne vrai si la valeur est un int
    this.isInt = function(value)
    {
        return ($inst.is(value) && (parseInt(value) === value))? true:false;
    }
    
    
    // castInt
    // retourne le nombre sous forme de int
    this.castInt = function(value)
    {
        return ($inst.is(value))? parseInt(value):null;
    }
    
    
    // castStr
    // retourne le nombre sous forme de string
    this.castStr = function(value)
    {
        return ($inst.is(value))? Number(value).toString():null;
    }
    
    
    // uniqueInt
    // retourne un int jamais utilisé, utile pour générer des ids unique
    this.uniqueInt = (function(value)
    {
        var i = 0;
        return function() {
            return i++;
        };
    })();
};