/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
  
// win
// object for window target
const WinTarget = {
    
    // is
    // retourne vrai si la valeur est window
    is: function(value) 
    {
        return value === window;
    },
    
    
    // hasHistoryApi
    // retourne vrai si le navigateur courant supporte history API
    hasHistoryApi: function()
    {
        let r = false;
        
        if(window.history && window.history.pushState && window.history.replaceState)
        {
            if(!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/))
            r = true;
        }
        
        return r;
    },
    
    
    // getScroll
    // retourne le scroll de la window, retourne aussi les dimensions
    getScroll: function()
    {
        return Pojo.replace({
            top: window.pageYOffset,
            left: window.pageXOffset,
        },Doc.getDimension(document));
    },
    
    
    // getDimension
    // retourne la dimension interne de la fênetre
    getDimension: function()
    {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
}

// win
const Win = Lemur.Win = Factory(TargetRoot,DataTarget,HandlerTarget,ListenerTarget,WinTarget);