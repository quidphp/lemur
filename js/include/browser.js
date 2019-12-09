/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// browser
// script with a some functions related to browsers
const Browser = new function() 
{    
    // isOldIe
    // retourne vrai si le navigateur est une vieille version de IE (IE 10 ou moins)
    this.isOldIe = function() 
    {
        let r = false;
        const msie = window.navigator.userAgent.indexOf('MSIE ');
        
        if(msie > 0)
        r = true;
        
        return r;
    }


    // isUnsupported
    // retourne vrai si le navigateur est insupporté
    this.isUnsupported = function() 
    {
        return this.isOldIe();
    }


    // allowsCookie
    // retourne vrai si les cookies sont activés
    this.allowsCookie = function()
    {
        let r = false;
        
        if(navigator.cookieEnabled) 
        r = true;
        
        else
        {
            document.cookie = "cookietest=1";
            r = document.cookie.indexOf("cookietest=") != -1;
            document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
        }

        return r;
    }
};

// export
Lemur.Browser = Browser;