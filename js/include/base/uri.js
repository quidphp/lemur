"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// uri
// script with a set of helper functions related to uri management
quid.base.uri = new function() {
    var base = quid.base;
    
    // isInternal
    // retourne vrai si l'uri et la comparaison ont le même scheme et host
    this.isInternal = function(uri,compare)
    {
        var r = false;
        
        if(base.str.is(uri))
        {
            compare = (base.str.is(compare))? this.parse(compare):base.request.parse();			
            var parse = this.parse(uri);
            
            if(parse.scheme === compare.scheme && parse.host === compare.host)
            r = true;
        }
        
        return r;
    }


    // isExternal
    // retourne vrai si l'uri et la comparaison n'ont pas le même scheme et host
    this.isExternal = function(uri,compare)
    {
        return (this.isInternal(uri,compare))? false:true;
    }


    // isExtension
    // retourne vrai si l'uri a une extension
    this.isExtension = function(uri)
    {
        return (this.extension(uri) != null)? true:false;
    }


    // hasFragment
    // retourne vrai si l'uri a un hash
    this.hasFragment = function(uri)
    {
        var r = false;
        
        if(base.str.is(uri))
        {
            var parse = this.parse(uri);
            
            if(base.str.isNotEmpty(parse.hash))
            r = true;
        }
        
        return r;
    }


    // isSamePathQuery
    // retourne vrai si l'uri est la même que la comparaison
    // compare path et query
    this.isSamePathQuery = function(uri,compare)
    {
        var r = false;
        
        if(base.str.is(uri))
        {
            compare = (base.str.is(compare))? this.parse(compare):base.request.parse();			
            var parse = this.parse(uri);
            
            if(parse.path === compare.path && parse.query === compare.query)
            r = true;
        }
        
        return r;
    }


    // isSamePathQueryHash
    // retourne vrai si l'uri est la même que la comparaison
    // compare path, query et hash
    this.isSamePathQueryHash = function(uri,compare)
    {
        var r = false;
        
        if(base.str.is(uri))
        {
            compare = (base.str.is(compare))? this.parse(compare):base.request.parse();			
            var parse = this.parse(uri);
            
            if(parse.path === compare.path && parse.query === compare.query && parse.hash === compare.hash)
            r = true;
        }
        
        return r;
    }


    // isHashChange
    // retourne vrai si l'uri est la même que la comparaison mais que le hash change
    this.isHashChange = function(uri,compare)
    {
        var r = false;
        
        if(base.str.is(uri))
        {
            compare = (base.str.is(compare))? this.parse(compare):base.request.parse();
            var parse = this.parse(uri);
            
            if(parse.scheme === compare.scheme && parse.host === compare.host && parse.path === compare.path && parse.query === compare.query)
            {
                if(base.str.isNotEmpty(parse.hash) && parse.hash !== compare.hash)
                r = true;
            }
        }
        
        return r;
    }


    // isHashSame
    // retourne vrai si l'uri est la même que la comparaison, que l'uri a un hash et que le hash est identique
    this.isHashSame = function(uri,compare)
    {
        var r = false;
        
        if(base.str.is(uri))
        {
            compare = (base.str.is(compare))? this.parse(compare):base.request.parse();
            var parse = this.parse(uri);
            
            if(parse.scheme === compare.scheme && parse.host === compare.host && parse.path === compare.path && parse.query === compare.query)
            {
                if(base.str.isNotEmpty(parse.hash) && parse.hash === compare.hash)
                r = true;
            }
        }
        
        return r;
    }


    // relative
    // retourne une uri relative à partir d'une uri absolut
    this.relative = function(uri,hash)
    {
        var r = null;
        
        if(base.str.is(uri))
        {
            var parse = this.parse(uri);
            r = parse.path;
            
            if(parse.query)
            r += "?"+parse.query;
            
            if(parse.hash && hash === true)
            r += "#"+parse.hash;
        }
        
        return r;
    }


    // extension
    // retourne l'extension du path de l'uri
    this.extension = function(uri)
    {
        var r = null;
        
        if(base.str.is(uri))
        {
            var regex = /(?:\.([^.]+))?$/;
            var parse = this.parse(uri);
            var result = regex.exec(parse.path);
            
            if(base.arr.is(result) && result.length === 2)
            r = result[1];
        }
        
        return r;
    }


    // parse
    // retourne un objet avec les différentes parties d'une uri séparés
    this.parse = function(uri)
    {
        var r = {};
        
        if(base.str.is(uri))
        {
            var $dom = document.createElement('a');
            $dom.href = uri;
            
            r.scheme = $dom.protocol.substr(0, $dom.protocol.indexOf(':')) || base.request.scheme();
            r.host = $dom.hostname;
            r.port = $dom.port;
            r.path = $dom.pathname;
            r.query = $dom.search.substr($dom.search.indexOf('?') + 1);
            r.hash = $dom.hash.substr($dom.hash.indexOf('#'));
            
            $dom = null;
        }
        
        return r;
    }


    // makeHash
    // permet de faire une hash avec ou sans le hash
    this.makeHash = function(value,symbol)
    {
        var r = null;
        
        if(base.str.isNotEmpty(value))
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
};