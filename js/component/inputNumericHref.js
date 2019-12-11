/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputNumericHref
// script with logic for an input containing a number which triggers a page change
const InputNumericHref = Component.InputNumericHref = function(option)
{
    // component
    Component.InputNumeric.call(this,option);
    
    
    // redirect
    ael(this,'inputNumeric:change',function() {
        const val = trigHandler(this,'input:getValueInt');
        const href = Dom.dataHrefReplaceChar(this,val);
        
        if(Str.isNotEmpty(href))
        trigHandler(document,'doc:go',href);
    });
    
    return this;
}