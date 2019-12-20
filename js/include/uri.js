/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// uri
// script with a set of helper functions related to uri management
const Uri = Lemur.Uri = {
    
    // isInternal
    // retourne vrai si l'uri et la comparaison ont le même scheme et host
    isInternal: function(uri,compare)
    {
        let r = false;
        
        if(Str.is(uri))
        {
            compare = (Str.is(compare))? this.parse(compare):Request.parse();			
            const parse = this.parse(uri);
            
            if(parse.scheme === compare.scheme && parse.host === compare.host)
            r = true;
        }
        
        return r;
    },


    // isExternal
    // retourne vrai si l'uri et la comparaison n'ont pas le même scheme et host
    isExternal: function(uri,compare)
    {
        return (this.isInternal(uri,compare))? false:true;
    },


    // hasExtension
    // retourne vrai si l'uri a une extension
    hasExtension: function(uri)
    {
        return (this.extension(uri) != null)? true:false;
    },


    // hasFragment
    // retourne vrai si l'uri a un hash
    hasFragment: function(uri)
    {
        let r = false;
        
        if(Str.is(uri))
        {
            const parse = this.parse(uri);
            
            if(Str.isNotEmpty(parse.hash))
            r = true;
        }
        
        return r;
    },

    
    // isOnlyHash
    // retourne vrai si l'uri est seulement un hash
    isOnlyHash: function(value)
    {
        return (Str.length(value) > 1 && Str.isStart('#',value));
    },
    
    
    // isSamePathQuery
    // retourne vrai si l'uri est la même que la comparaison
    // compare path et query
    isSamePathQuery: function(uri,compare)
    {
        let r = false;
        
        if(Str.is(uri))
        {
            compare = (Str.is(compare))? this.parse(compare):Request.parse();			
            const parse = this.parse(uri);
            
            if(parse.path === compare.path && parse.query === compare.query)
            r = true;
        }
        
        return r;
    },


    // isSamePathQueryHash
    // retourne vrai si l'uri est la même que la comparaison
    // compare path, query et hash
    isSamePathQueryHash: function(uri,compare)
    {
        let r = false;
        
        if(Str.is(uri))
        {
            compare = (Str.is(compare))? this.parse(compare):Request.parse();			
            const parse = this.parse(uri);
            
            if(parse.path === compare.path && parse.query === compare.query && parse.hash === compare.hash)
            r = true;
        }
        
        return r;
    },


    // isHashChange
    // retourne vrai si l'uri est la même que la comparaison mais que le hash change
    isHashChange: function(uri,compare)
    {
        let r = false;
        
        if(Str.is(uri))
        {
            compare = (Str.is(compare))? this.parse(compare):Request.parse();
            const parse = this.parse(uri);
            
            if(parse.scheme === compare.scheme && parse.host === compare.host && parse.path === compare.path && parse.query === compare.query)
            {
                if(Str.isNotEmpty(parse.hash) && parse.hash !== compare.hash)
                r = true;
            }
        }
        
        return r;
    },


    // isSameWithHash
    // retourne vrai si l'uri est la même que la comparaison, que l'uri a un hash et que le hash est identique
    isSameWithHash: function(uri,compare)
    {
        return (this.hasFragment(uri) && uri === compare)? true:false;
    },


    // relative
    // retourne une uri relative
    relative: function(uri,hash)
    {
        return this.build(this.parse(uri),false,hash);
    },

    
    // absolute
    // retourne une uri absolute
    absolute: function(uri,hash)
    {
        return this.build(this.parse(uri),true,hash);
    },
    
    
    // extension
    // retourne l'extension du path de l'uri
    extension: function(uri)
    {
        let r = null;
        
        if(Str.is(uri))
        {
            const regex = /(?:\.([^.]+))?$/;
            const parse = this.parse(uri);
            const result = regex.exec(parse.path);
            
            if(Arr.is(result) && result.length === 2)
            r = result[1];
        }
        
        return r;
    },


    // parse
    // retourne un objet avec les différentes parties d'une uri séparés
    // ne marche pas bien sur ie11
    parse: function(uri)
    {
        let r = {};
        
        if(Str.is(uri))
        {
            let $dom = document.createElement('a');
            $dom.href = uri;
            
            r.scheme = $dom.protocol.substr(0, $dom.protocol.indexOf(':')) || Request.scheme();
            r.host = $dom.hostname || Request.host();
            r.port = $dom.port;
            r.path = $dom.pathname;
            r.query = $dom.search.substr($dom.search.indexOf('?') + 1);
            r.hash = $dom.hash.substr($dom.hash.indexOf('#') + 1);
            
            if(!Str.isStart('/',r.path))
            r.path = '/'+r.path;
            
            $dom = null;
        }
        
        return r;
    },

    
    // build
    // prend un objet parse et retourne une string uri
    // possible de retourner une string relative ou absolute
    // possible d'inclure ou non le hash
    build: function(parse,absolute,hash)
    {
        let r = null;
        
        if(Pojo.isNotEmpty(parse))
        {
            r = '';
            
            if(absolute === true)
            {
                r += parse.scheme;
                r += "://";
                r += parse.host;
            }
            
            r += parse.path;
            
            if(parse.query)
            r += "?"+parse.query;

            if(parse.hash && hash === true)
            r += "#"+parse.hash;
        }
        
        return r;
    },
    
    
    // makeHash
    // permet de faire une hash avec ou sans le hash
    makeHash: function(value,symbol)
    {
        let r = '';
        
        if(Str.isNotEmpty(value))
        {
            r = value;
            const hasHash = (Str.isStart('#',r))? true:false;
            
            if(symbol === true)
            r = (!hasHash)? "#"+r:r;
            
            else if(hasHash)
            r = Str.sub(1,true,r);
        }
        
        else if(symbol === true)
        r = '#';
        
        return r;
    },
    
    
    // getMailto
    // permet d'obtenir un email à partir d'un mailto (comme dans un href)
    getMailto: function(value)
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