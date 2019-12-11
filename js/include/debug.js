/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// debug
// script with functions related to debugging
const Debug = Lemur.Debug = new function()
{   
    // status debug, peut être scalar
    let debug = false;
    
    
    // is
    // retourne vrai si la valeur pour le débogagge est le même
    this.is = function(value)
    {
        return debug === true || debug === value;
    }
    
    
    // status
    // active ou désactive le débogagge
    this.status = (function()
    {
        return function(value) {
            if(Scalar.is(value))
            debug = value;
            
            return debug;
        }
    })()
    
    
    // assertThrow
    // comme assert mais lance une errur
    this.assertThrow = function(value) 
    {
        if(value !== true)
        throw new Error();
    },
    
    
    // logError
    // permet de logger une erreur
    this.logError = function(value)
    {
        console.error('Catched',value);
    }
}