/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputSearchHref
// script containing logic for a search input which triggers a page change
Component.InputSearchHref = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // component
    Component.InputSearch.call(this,option);
    
    
    // handler
    ael(this,'inputSearch:change',function() {
        const char = getAttr(this,"data-char");
        let val = trigHdlr(this,'input:getValueEncoded',true);
        let href = getAttr(this,"data-href");
        
        if(Str.isNotEmpty(val))
        href += "?"+char+"="+val;
        
        trigHdlr(document,'history:href',href);
    });
    
    return this;
}