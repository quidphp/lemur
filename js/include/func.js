/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// handler
// script with functions related to functions
const FuncObj = {
    
    // is
    // retourne vrai si la valeur est une fonction
    is: function(value) 
    {
        return typeof value === "function" && typeof value.nodeType !== "number";
    },
    
    
    // noop
    // retourne une fonction vide
    noop: function() 
    {
        return function() {};
    },
    
    
    // async
    // comme timeout, mais la durée est automatiquement 0
    async: function(func) 
    {
        return this.timeout(0,func);
    },
    
    
    // timeout
    // permet d'appeler une fois après un timeout
    // si timeout n'est pas integer, utlise 0
    // retourne le timeout
    timeout: function(delay,func) 
    {
        Func.check(func);
        
        if(!Integer.is(delay))
        delay = 0;
        
        return setTimeout(func,delay);
    },
    
    
    // debounce
    // permet d'appeler une fonction une seule fois après le délai spécifié par le timeout
    // retourne une nouvelle fonction
    debounce: function(delay,func) 
    {
        Integer.check(delay);
        Func.check(func);
        const $inst = this;
        let timeout;
        
        return function() {
            const args = arguments;
            
            if(timeout)
            clearTimeout(timeout);
            
            timeout = $inst.timeout(delay,function() {
                func.apply(null,args);
            });
        }
    },
    
    
    // throttle
    // permet de limiter le rythme d'appel à une fonction
    // retourne une nouvelle fonction
    throttle: function(delay,func) 
    {
        Integer.check(delay);
        Func.check(func);
        const $inst = this;
        let canCall = true;
        
        return function() {
            if(canCall === true)
            {
                func.apply(null,arguments);
                canCall = false;
                
                $inst.timeout(delay,function() {
                    canCall = true;
                });
            }
        }
    }
}