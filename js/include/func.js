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
    
    
    // debounce
    // permet d'appeler une fonction une seule fois
    // après le délai spécifié par le timeout
    debounce: function(timeout,func) {
        Integer.check(timeout);
        Func.check(func);
        
        return function() {
            let previousCall = this.lastCall;
            this.lastCall = Date.now();
            const args = arguments;
            
            if(previousCall && ((this.lastCall - previousCall) <= timeout))
            clearTimeout(this.lastCallTimer);
            
            this.lastCallTimer = setTimeout(function() {
                func.apply(null,args);
            },timeout);
        }
    },
    
    
    // throttle
    // permet de limiter le rythme d'appel à une fonction
    throttle: function(timeout,func) {
        Integer.check(timeout);
        Func.check(func);
        
        return function() {
            let previousCall = this.lastCall;
            this.lastCall = Date.now();
            
            if(previousCall == null || (this.lastCall - previousCall) > timeout)
            return func.apply(null,arguments);
        }
    }
}