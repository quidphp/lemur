/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// datetime
// script with functions related to date and time
const Datetime = new function() 
{   
    // now
    // retourne le timestamp courant
    this.now = function() 
    {
        return (new Date).getTime();
    }
}

// export
Lemur.Datetime = Datetime;