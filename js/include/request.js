/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// request
// script with functions related to the current request
const Request = Lemur.Request = Factory(true,
{    
    // relative
    // retourne l'uri relative courante
    relative: function() 
    {
        return window.location.pathname + window.location.search;
    },


    // scheme
    // retourne le scheme courant
    scheme: function()
    {
        return location.protocol.substr(0, location.protocol.indexOf(':'));
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
        return {
            scheme: this.scheme(), 
            host: location.hostname, 
            path: location.pathname, 
            query: location.search, 
            hash: location.hash
        };
    }
});