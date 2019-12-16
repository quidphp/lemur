/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// confirm
// component to request a confirmation once an event has triggered
Component.Confirm = function(type) 
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlr(this,'confirm:getText',function() {
        return getAttr(this,'data-confirm');
    });
    
    
    // event
    ael(this,type,function(event) {
        const confirmText = trigHdlr(this,'confirm:getText');
        
        if(Str.isNotEmpty(confirmText) && !confirm(confirmText))
        {
            Evt.preventStop(event,true);
            trigEvt(this,'confirm:no',event);
            
            return false;
        }
        
        else
        trigEvt(this,'confirm:yes',event);
    });
    
    return this;
}