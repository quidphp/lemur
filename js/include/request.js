/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// request
// script with functions related to the current request
Quid.Request = new function() 
{    
    // instance
    var $inst = this;
    
    
    // relative
    // retourne l'uri relative courante
    this.relative = function() 
    {
        return window.location.pathname + window.location.search;
    }


    // scheme
    // retourne le scheme courant
    this.scheme = function()
    {
        return location.protocol.substr(0, location.protocol.indexOf(':'));
    }


    // fragment
    // retourne le fragment de l'uri sans le hash
    this.fragment = function() 
    {
        return Quid.Uri.makeHash(window.location.hash);
    }


    // parse
    // retourne un objet avec les différentes parties de l'uri courante séparés
    this.parse = function()
    {
        return {
            scheme: this.scheme(), 
            host: location.hostname, 
            path: location.pathname, 
            query: location.search, 
            hash: location.hash
        };
    }
};