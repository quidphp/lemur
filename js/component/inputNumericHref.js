/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputNumericHref
// script with logic for an input containing a number which triggers a page change
Component.InputNumericHref = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // component
    Component.InputNumeric.call(this,option);
    Component.HrefReplaceChar.call(this);
    
    
    // redirect
    ael(this,'inputNumeric:change',function() {
        const val = trigHdlr(this,'input:getValueInt');
        const href = trigHdlr(this,'hrefReplaceChar:make',val);
        
        if(Str.isNotEmpty(href))
        trigHdlr(document,'history:href',href);
    });
    
    return this;
}