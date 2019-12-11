/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputSearchHref
// script containing logic for a search input which triggers a page change
const InputSearchHref = Component.InputSearchHref = function(option)
{
    // component
    Component.InputSearch.call(this,option);
    
    
    // handler
    ael(this,'inputSearch:change',function() {
        const char = $(this).attr("data-char");
        let val = trigHandler(this,'input:getValueEncoded',true);
        let href = $(this).attr("data-href");
        
        if(Str.isNotEmpty(val))
        href += "?"+char+"="+val;
        
        trigHandler(document,'doc:go',href);
    });
    
    return this;
}