/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// date
// script with functions related to date and time
quid.date = new function() 
{   
    // instance
    var $inst = this;
    
    
    // timestamp
    // retourne le timestamp courant
    this.timestamp = function() 
    {
        return (new Date).getTime();
    }
};