/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// request
// script with functions related to the current request
const Request = Lemur.Request = {
    
    // relative
    // retourne l'uri relative courante
    relative: function() 
    {
        return window.location.pathname + window.location.search;
    },

    
    // absolute
    // retourne l'uri absolute courante
    absolute: function()
    {
        return window.location.href;
    },
    
    
    // scheme
    // retourne le scheme courant
    scheme: function()
    {
        return location.protocol.substr(0, location.protocol.indexOf(':'));
    },

    
    // host
    // retourne le host courante
    host: function()
    {
        return location.hostname;
    },
    
    
    // schemeHost
    // retourne le schemeHost courant
    schemeHost: function()
    {
        return location.origin;
    },
    
    
    // fragment
    // retourne le fragment de l'uri sans le hash
    fragment: function() 
    {
        return Uri.makeHash(window.location.hash);
    },


    // parse
    // retourne un objet avec les différentes parties de l'uri courante séparés
    parse: function()
    {
        return new URL(this.absolute());
    }
}