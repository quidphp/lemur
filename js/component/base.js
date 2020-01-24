/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// base
// base component which allow to activate or deactivate components
Component.Base = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlr(this,'base:getInputs',function() {
        return qsa(this,Dom.selectorInput(true));
    });
    
    
    // event
    ael(this,'component:enable',function() {
        const inputs = trigHdlr(this,'base:getInputs');
        
        Ele.each(inputs,function() {
            if(trigHdlr(this,'input:isBinded'))
            trigHdlrs(inputs,'input:enable');
            else
            setProp(this,'disabled',false)
        });
    });
    
    ael(this,'component:disable',function() {
        const inputs = trigHdlr(this,'base:getInputs');
        
        Ele.each(inputs,function() {
            if(trigHdlr(this,'input:isBinded'))
            trigHdlr(this,'input:disable');
            else
            setProp(this,'disabled',true);
        });
    });
    
    return this;
}