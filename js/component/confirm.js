/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// confirm
// component to request a confirmation once an event has triggered
const Confirm = Component.Confirm = function(type) 
{
    // func
    setFunc(this,'confirm:getText',function() {
        return $(this).data('confirm');
    });
    
    
    // event
    ael(this,type,function(event) {
        const confirmText = triggerFunc(this,'confirm:getText');
        
        if(Str.isNotEmpty(confirmText) && !confirm(confirmText))
        {
            Evt.preventStop(event,true);
            triggerEvent(this,'confirm:no',event);
            
            return false;
        }
        
        else
        triggerEvent(this,'confirm:yes',event);
    });
    
    return this;
}