"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// uri
// script with a set of helper functions related to uri management

// currentRelativeUri
// retourne l'uri relative courante
quid.base.currentRelativeUri = function() 
{
    return window.location.pathname + window.location.search;
}


// currentScheme
// retourne le scheme courant
quid.base.currentScheme = function()
{
    return location.protocol.substr(0, location.protocol.indexOf(':'));
}


// fragment
// retourne le fragment de l'uri sans le hash
quid.base.fragment = function() 
{
    return quid.base.formatHash(window.location.hash);
}


// formatHash
// permet de faire une hash avec ou sans le hash
quid.base.formatHash = function(value,symbol)
{
    var r = null;
    
    if(quid.base.isStringNotEmpty(value))
    {
        r = value;
        var hasHash = (r.charAt(0) === "#")? true:false;
        
        if(symbol === true && !hasHash)
        r = "#"+r;
        
        else if(hasHash)
        r = r.substring(1);
    }
    
    return r;
}


// relativeUri
// retourne une uri relative à partir d'une uri absolut
quid.base.relativeUri = function(uri,hash)
{
    var r = null;
    
    if(quid.base.isString(uri))
    {
        var parse = quid.base.parseUri(uri);
        r = parse.path;
        
        if(parse.query)
        r += "?"+parse.query;
        
        if(parse.hash && hash === true)
        r += "#"+parse.hash;
    }
    
    return r;
}


// isUriInternal
// retourne vrai si l'uri et la comparaison ont le même scheme et host
quid.base.isUriInternal = function(uri,compare)
{
    var r = false;
    
    if(quid.base.isString(uri))
    {
        compare = (quid.base.isString(compare))? quid.base.parseUri(compare):quid.base.parseCurrentUri();			
        var parse = quid.base.parseUri(uri);
        
        if(parse.scheme === compare.scheme && parse.host === compare.host)
        r = true;
    }
    
    return r;
}


// isUriExternal
// retourne vrai si l'uri et la comparaison n'ont pas le même scheme et host
quid.base.isUriExternal = function(uri,compare)
{
    return (quid.base.isUriInternal(uri,compare))? false:true;
}


// isSamePathQuery
// retourne vrai si l'uri est la même que la comparaison
// compare path et query
quid.base.isSamePathQuery = function(uri,compare)
{
    var r = false;
    
    if(quid.base.isString(uri))
    {
        compare = (quid.base.isString(compare))? quid.base.parseUri(compare):quid.base.parseCurrentUri();			
        var parse = quid.base.parseUri(uri);
        
        if(parse.path === compare.path && parse.query === compare.query)
        r = true;
    }
    
    return r;
}


// isSamePathQueryHash
// retourne vrai si l'uri est la même que la comparaison
// compare path, query et hash
quid.base.isSamePathQueryHash = function(uri,compare)
{
    var r = false;
    
    if(quid.base.isString(uri))
    {
        compare = (quid.base.isString(compare))? quid.base.parseUri(compare):quid.base.parseCurrentUri();			
        var parse = quid.base.parseUri(uri);
        
        if(parse.path === compare.path && parse.query === compare.query && parse.hash === compare.hash)
        r = true;
    }
    
    return r;
}


// isHashChange
// retourne vrai si l'uri est la même que la comparaison mais que le hash change
quid.base.isHashChange = function(uri,compare)
{
    var r = false;
    
    if(quid.base.isString(uri))
    {
        compare = (quid.base.isString(compare))? quid.base.parseUri(compare):quid.base.parseCurrentUri();
        var parse = quid.base.parseUri(uri);
        
        if(parse.scheme === compare.scheme && parse.host === compare.host && parse.path === compare.path && parse.query === compare.query)
        {
            if(quid.base.isStringNotEmpty(parse.hash) && parse.hash !== compare.hash)
            r = true;
        }
    }
    
    return r;
}


// isHashSame
// retourne vrai si l'uri est la même que la comparaison, que l'uri a un hash et que le hash est identique
quid.base.isHashSame = function(uri,compare)
{
    var r = false;
    
    if(quid.base.isString(uri))
    {
        compare = (quid.base.isString(compare))? quid.base.parseUri(compare):quid.base.parseCurrentUri();
        var parse = quid.base.parseUri(uri);
        
        if(parse.scheme === compare.scheme && parse.host === compare.host && parse.path === compare.path && parse.query === compare.query)
        {
            if(quid.base.isStringNotEmpty(parse.hash) && parse.hash === compare.hash)
            r = true;
        }
    }
    
    return r;
}


// uriExtension
// retourne l'extension du path de l'uri
quid.base.uriExtension = function(uri)
{
    var r = null;
    
    if(quid.base.isString(uri))
    {
        var regex = /(?:\.([^.]+))?$/;
        var parse = quid.base.parseUri(uri);
        var result = regex.exec(parse.path);
        
        if($.isArray(result) && result.length === 2)
        r = result[1];
    }
    
    return r;
}


// isUriHash
// retourne vrai si l'uri a un hash
quid.base.isUriHash = function(uri)
{
    var r = false;
    
    if(quid.base.isString(uri))
    {
        var parse = quid.base.parseUri(uri);
        
        if(quid.base.isStringNotEmpty(parse.hash))
        r = true;
    }
    
    return r;
}


// isUriExtension
// retourne vrai si l'uri a une extension
quid.base.isUriExtension = function(uri)
{
    return (quid.base.uriExtension(uri) != null)? true:false;
}


// parseCurrentUri
// retourne un objet avec les différentes parties de l'uri courante séparés
quid.base.parseCurrentUri = function()
{
    return {
        scheme: quid.base.currentScheme(), 
        host: location.hostname, 
        path: location.path, 
        query: location.query, 
        hash: location.hash
    };
}


// parseUri
// retourne un objet avec les différentes parties d'une uri séparés
quid.base.parseUri = function(uri)
{
    var r = {};
    
    if(quid.base.isString(uri))
    {
        var $dom = document.createElement('a');
        $dom.href = uri;
        
        r.scheme = $dom.protocol.substr(0, $dom.protocol.indexOf(':')) || quid.base.currentScheme();
        r.host = $dom.hostname || location.hostname;
        r.port = $dom.port;
        r.path = $dom.pathname;
        r.query = $dom.search.substr($dom.search.indexOf('?') + 1);
        r.hash = $dom.hash.substr($dom.hash.indexOf('#'));
        
        $dom = null;
    }
    
    return r;
}


// mailto
// permet d'obtenir un email à partir d'un mailto (comme dans un href)
quid.base.mailto = function(value)
{
    var r = null;
    
    if(quid.base.isStringNotEmpty(value))
    r = value.replace(/mailto:/,'');
    
    return r;
}