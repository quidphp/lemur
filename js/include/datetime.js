/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// datetime
// script with functions related to date and time
const Datetime = new function() 
{   
    // instance
    const $inst = this;
    
    
    // timestamp
    // retourne le timestamp courant
    this.timestamp = function() 
    {
        return (new Date).getTime();
    }
}

// export
Lemur.Datetime = Datetime;