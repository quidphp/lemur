/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// ClickOpenTriggerBase
// grants base functions for a clickOpen component which has a trigger to open/close
const ClickOpenTriggerBase = Component.ClickOpenTriggerBase = function(option)
{
    // option
    const $option = Object.assign({
        trigger: true,
        triggerEvent: 'click',
        triggerToggle: true
    },option);
    
    
    // func
    setFunc(this,'clickOpen:getTrigger',function() {
        let r = $option.trigger;
        
        if(r == true)
        r = this;
        
        if(Str.isNotEmpty(r))
        r = qs(this,r);
        
        return r;
    });
    
    setFunc(this,'clickOpen:triggerClick',function(clickEvent) {
        if($option.triggerToggle === true && triggerFunc(this,'clickOpen:isOpen'))
        triggerEvent(this,'clickOpen:close');
        else
        triggerFunc(this,'clickOpen:triggerClickOpen');
    });
    
    setFunc(this,'clickOpen:triggerClickOpen',function() {
        triggerEvent(this,'clickOpen:open');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function(event) {
        const $this = this;
        const trigger = triggerFunc(this,'clickOpen:getTrigger');
        
        if(trigger != null)
        {
            ael(trigger,$option.triggerEvent,function(event) {
                triggerFunc($this,'clickOpen:triggerClick',event);
                Evt.preventStop(event);
                return false;
            });
            
            aelDelegate(trigger,'click','a',function(event) {
                triggerFunc(document,'doc:clickEvent',event);
            });
        }
    });
    
    return this;
}