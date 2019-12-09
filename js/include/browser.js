/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// browser
// script with a some functions related to browsers
const Browser = Lemur.Browser = Factory(true,
{    
    // isOldIe
    // retourne vrai si le navigateur est une vieille version de IE (IE 10 ou moins)
    isOldIe: function() 
    {
        let r = false;
        const msie = window.navigator.userAgent.indexOf('MSIE ');
        
        if(msie > 0)
        r = true;
        
        return r;
    },


    // isUnsupported
    // retourne vrai si le navigateur est insupporté
    isUnsupported: function() 
    {
        return this.isOldIe();
    },


    // allowsCookie
    // retourne vrai si les cookies sont activés
    allowsCookie: function()
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
});