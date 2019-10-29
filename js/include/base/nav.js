"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// nav
// script with helper functions related to navigation and pagination

// indexer
// retourne l'index du nouvel élément
quid.base.indexer = function(value,current,max,loop)
{
    var r = null;
    
    if(value instanceof jQuery && max instanceof jQuery)
    r = max.index(value);
    
    else
    {
        if(max instanceof jQuery)
        {
            if(current instanceof jQuery)
            current = max.index(current);
            
            max = max.length;
        }
        
        if($.isNumeric(max) && max > 0)
        {
            var first = 0;
            var last = (max - 1);
            
            if(value === 'first')
            r = first;
            
            else if(value ==='last')
            r = last;
            
            else if(value === 'next' && $.isNumeric(current))
            {
                r = (current + 1);
                
                if(r > last)
                {
                    if(loop === true)
                    r = first;
                    
                    else
                    r = null;
                }
            }
            
            else if(value === 'prev' && $.isNumeric(current))
            {
                r = (current - 1);
                
                if(r < 0)
                {
                    if(loop === true)
                    r = last;
                    
                    else
                    r = null;
                }
            }
            
            else if($.isNumeric(value) && value >= 0 && value < max)
            r = value;
        }
    }
    
    return r;
}