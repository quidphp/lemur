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
    

    // handler
    setHandler(this,'clickOpen:getTrigger',function() {
        let r = $option.trigger;
        
        if(r == true)
        r = this;
        
        if(Str.isNotEmpty(r))
        r = qs(this,r);
        
        return r;
    });
    
    setHandler(this,'clickOpen:triggerClickOpen',function() {
        trigEvt(this,'clickOpen:open');
    });
    
    
    // event
    ael(this,'clickOpen:triggerClick',function(clickEvent) {
        if($option.triggerToggle === true && trigHandler(this,'clickOpen:isOpen'))
        trigEvt(this,'clickOpen:close');
        else
        trigHandler(this,'clickOpen:triggerClickOpen');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function(event) {
        const $this = this;
        const trigger = trigHandler(this,'clickOpen:getTrigger');
        
        if(trigger != null)
        {
            ael(trigger,$option.triggerEvent,function(event) {
                trigEvt($this,'clickOpen:triggerClick',event);
                Evt.preventStop(event);
                return false;
            });
            
            aelDelegate(trigger,'click','a',function(event) {
                trigHandler(document,'doc:clickEvent',event);
            });
        }
    });
    
    return this;
}