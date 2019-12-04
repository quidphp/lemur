/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// bool
// script with functions related to booleans
const Bool = new function() 
{
    // instance
    const $inst = this;
    
    
    // is
    // retourne vrai si la valeur est une fonction
    this.is = function(value) 
    {
        return typeof(value) === 'boolean';
    }
    
    
    // num
    // retourne un booléean sous forme de int
    this.num = function(value)
    {
        let r = null;
        
        if(value === true)
        r = 1;

        else if(value === false)
        r = 0;
        
        return r;
    }
    
    
    // toggle
    // permet de faire un toggle sur une valeur boolean, ou similaire à boolean
    this.toggle = function(value)
    {
        let r = null;

        if(value === true)
        r = false;

        else if(value === false)
        r = true;

        else if(value === 1)
        r = 0;

        else if(value === 0)
        r = 1;

        else if(value === '1')
        r = '0';

        else if(value === '0')
        r = '1';

        return r;
    }
    
}

// export
Lemur.Bool = Bool;