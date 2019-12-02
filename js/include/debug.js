/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// debug
// script with functions related to debugging
const Debug = new function() 
{   
    // instance
    const $inst = this;
    
    
    // comme assert mais lance une exception
    this.assertThrow = function(value) 
    {
        if(value !== true)
        {
            console.error('Assert throw');
            console.trace();
            throw new Exception();
        }
    };
}

// export
Lemur.Debug = Debug;