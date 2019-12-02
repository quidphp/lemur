/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// uri
// script with a set of helper functions related to uri management
const Uri = new function() 
{
    // instance
    const $inst = this;
    
        
    // isInternal
    // retourne vrai si l'uri et la comparaison ont le même scheme et host
    this.isInternal = function(uri,compare)
    {
        let r = false;
        
        if(Str.is(uri))
        {
            compare = (Str.is(compare))? $inst.parse(compare):Request.parse();			
            const parse = $inst.parse(uri);
            
            if(parse.scheme === compare.scheme && parse.host === compare.host)
            r = true;
        }
        
        return r;
    }


    // isExternal
    // retourne vrai si l'uri et la comparaison n'ont pas le même scheme et host
    this.isExternal = function(uri,compare)
    {
        return ($inst.isInternal(uri,compare))? false:true;
    }


    // hasExtension
    // retourne vrai si l'uri a une extension
    this.hasExtension = function(uri)
    {
        return ($inst.extension(uri) != null)? true:false;
    }


    // hasFragment
    // retourne vrai si l'uri a un hash
    this.hasFragment = function(uri)
    {
        let r = false;
        
        if(Str.is(uri))
        {
            const parse = $inst.parse(uri);
            
            if(Str.isNotEmpty(parse.hash))
            r = true;
        }
        
        return r;
    }


    // isSamePathQuery
    // retourne vrai si l'uri est la même que la comparaison
    // compare path et query
    this.isSamePathQuery = function(uri,compare)
    {
        let r = false;
        
        if(Str.is(uri))
        {
            compare = (Str.is(compare))? $inst.parse(compare):Request.parse();			
            const parse = $inst.parse(uri);
            
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
        let r = false;
        
        if(Str.is(uri))
        {
            compare = (Str.is(compare))? $inst.parse(compare):Request.parse();			
            const parse = $inst.parse(uri);
            
            if(parse.path === compare.path && parse.query === compare.query && parse.hash === compare.hash)
            r = true;
        }
        
        return r;
    }


    // isHashChange
    // retourne vrai si l'uri est la même que la comparaison mais que le hash change
    this.isHashChange = function(uri,compare)
    {
        let r = false;
        
        if(Str.is(uri))
        {
            compare = (Str.is(compare))? $inst.parse(compare):Request.parse();
            const parse = $inst.parse(uri);
            
            if(parse.scheme === compare.scheme && parse.host === compare.host && parse.path === compare.path && parse.query === compare.query)
            {
                if(Str.isNotEmpty(parse.hash) && parse.hash !== compare.hash)
                r = true;
            }
        }
        
        return r;
    }


    // isSameWithHash
    // retourne vrai si l'uri est la même que la comparaison, que l'uri a un hash et que le hash est identique
    this.isSameWithHash = function(uri,compare)
    {
        return ($inst.hasFragment(uri) && uri === compare)? true:false;
    }


    // relative
    // retourne une uri relative à partir d'une uri absolut
    this.relative = function(uri,hash)
    {
        let r = null;
        
        if(Str.is(uri))
        {
            const parse = $inst.parse(uri);
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
        let r = null;
        
        if(Str.is(uri))
        {
            const regex = /(?:\.([^.]+))?$/;
            const parse = $inst.parse(uri);
            const result = regex.exec(parse.path);
            
            if(Arr.is(result) && result.length === 2)
            r = result[1];
        }
        
        return r;
    }


    // parse
    // retourne un objet avec les différentes parties d'une uri séparés
    this.parse = function(uri)
    {
        let r = {};
        
        if(Str.is(uri))
        {
            let $dom = document.createElement('a');
            $dom.href = uri;
            
            r.scheme = $dom.protocol.substr(0, $dom.protocol.indexOf(':')) || Request.scheme();
            r.host = $dom.hostname;
            r.port = $dom.port;
            r.path = $dom.pathname;
            r.query = $dom.search.substr($dom.search.indexOf('?') + 1);
            r.hash = $dom.hash.substr($dom.hash.indexOf('#') + 1);
            
            $dom = null;
        }
        
        return r;
    }


    // makeHash
    // permet de faire une hash avec ou sans le hash
    this.makeHash = function(value,symbol)
    {
        let r = null;
        
        if(Str.isNotEmpty(value))
        {
            r = value;
            const hasHash = (r.charAt(0) === "#")? true:false;
            
            if(symbol === true)
            r = (!hasHash)? "#"+r:r;
            
            else if(hasHash)
            r = r.substring(1);
        }
        
        return r;
    }
    
    
    // getMailto
    // permet d'obtenir un email à partir d'un mailto (comme dans un href)
    this.getMailto = function(value)
    {
        let r = null;
        
        if(Str.isNotEmpty(value))
        {
            const email = value.replace(/mailto:/,'');
            
            if(Validate.isEmail(email))
            r = email;
        }
        
        return r;
    }
}

// export
Lemur.Uri = Uri;