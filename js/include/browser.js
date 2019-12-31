/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// browser
// script with a some functions related to browsers
const Browser = Lemur.Browser = {
    
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

    
    // isIe11
    // retourne vrai si le navigateur est ie11
    isIe11: function()
    {
        let r = false;
        const trident = window.navigator.userAgent.indexOf('Trident/');
        
        if(trident > 0)
        r = true;
        
        return r;
    },
    
    
    // isIe
    // retourne vrai si le navigateur est internet explorer
    isIe: function()
    {
        return this.isOldIe() || this.isIe11();
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
            r = document.cookie.indexOf("cookietest=") !== -1;
            document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
        }

        return r;
    }
}