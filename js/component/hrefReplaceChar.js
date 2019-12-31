/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// hrefReplaceChar
// component to generate a dynamic href with some value replacement
Component.HrefReplaceChar = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    setHdlrs(this,'hrefReplaceChar:',{
        
        getHref: function() {
            return Ele.getAttr(this,'data-href');
        },
        
        getChar: function() {
            return Ele.getAttr(this,'data-char');
        },
        
        make: function(replace,replace2) {
            let r = null;
            const href = trigHdlr(this,'hrefReplaceChar:getHref');
            const char = trigHdlr(this,'hrefReplaceChar:getChar');
            replace = (Num.is(replace))? Str.cast(replace):replace
            replace2 = (Num.is(replace2))? Str.cast(replace2):replace2;
            
            if(Str.isNotEmpty(replace) && Str.isNotEmpty(href) && Str.isNotEmpty(char))
            {
                r = href.replace(char,replace);
                
                if(Str.isNotEmpty(replace2))
                r = r.replace(char,replace2);
            }
            
            return r;
        }
    });
    
    return this;
}