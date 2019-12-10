/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// datetime
// script with functions related to date and time
const Datetime = Lemur.Datetime = {
    
    // now
    // retourne le timestamp courant
    now: function() 
    {
        return (new Date).getTime();
    }
}