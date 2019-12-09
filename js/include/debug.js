/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// debug
// script with functions related to debugging
const Debug = Lemur.Debug = Factory(true,
{   
    // assertThrow
    // comme assert mais lance une errur
    assertThrow: function(value) 
    {
        if(value !== true)
        throw new Error();
    },
    
    
    // logError
    // permet de logger une erreur
    logError: function(value)
    {
        console.error('Catched',value);
    }
});