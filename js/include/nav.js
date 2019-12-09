/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// nav
// script with helper functions related to navigation and pagination
const Nav = Lemur.Nav = Factory(true,
{    
    // index
    // retourne l'index du nouvel élément
    index: function(value,current,max,loop)
    {
        let r = undefined;
        
        if(Integer.is(max) && max > 0)
        {
            const first = 0;
            const last = (max - 1);
            
            if(value === 'first')
            r = first;
            
            else if(value ==='last')
            r = last;
            
            else if(value === 'next' && Integer.is(current))
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
            
            else if(value === 'prev' && Integer.is(current))
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
            
            else if(Integer.is(value) && value >= 0 && value < max)
            r = value;
        }
        
        return r;
    }
});