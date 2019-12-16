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
        return qsa(this,Selector.input(true));
    });
    
    
    // event
    ael(this,'component:enable',function() {
        const inputs = trigHdlr(this,'base:getInputs');
        
        Dom.each(inputs,function() {
            if(trigHdlr(this,'input:isBinded'))
            trigEvt(inputs,'input:enable');
            else
            $(this).prop('disabled',false);
        });
    });
    
    ael(this,'component:disable',function() {
        const inputs = trigHdlr(this,'base:getInputs');
        
        Dom.each(inputs,function() {
            if(trigHdlr(this,'input:isBinded'))
            trigEvt(inputs,'input:disable');
            else
            $(this).prop('disabled',true);
        });
    });
    
    return this;
}