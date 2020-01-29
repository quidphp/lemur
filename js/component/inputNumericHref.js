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
    
    
    // handlers
    setHdlr(this,'inputNumericHref:getCurrent',function() {
        return getAttr(this,"data-current",'int');
    });
    
    setHdlr(this,'inputNumericHref:setCurrent',function() {
        setAttr(this,"data-current",value);
    });
    
    setHdlr(this,'inputNumeric:getValueRestore',function() {
        return trigHdlr(this,'inputNumericHref:getCurrent');
    });
    
    setHdlr(this,'inputNumeric:shouldChange',function() {
        const current = trigHdlr(this,'inputNumericHref:getCurrent');
        const val = trigHdlr(this,'input:getValueInt');

        return (val !== current);
    });
    
    
    // redirect
    ael(this,'inputNumeric:change',function() {
        const val = trigHdlr(this,'input:getValueInt');
        const href = trigHdlr(this,'hrefReplaceChar:make',val);
        
        if(Str.isNotEmpty(href))
        trigHdlr(document,'history:href',href);
    });
    
    return this;
}