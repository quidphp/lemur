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
    const $option = Pojo.replace({
        trigger: true,
        triggerEvent: 'click',
        triggerToggle: true
    },option);
    

    // handler
    setHdlr(this,'clickOpen:getTrigger',function() {
        let r = $option.trigger;
        
        if(r == true)
        r = this;
        
        if(Str.isNotEmpty(r))
        r = qs(this,r);
        
        return r;
    });
    
    setHdlr(this,'clickOpen:triggerClickOpen',function() {
        trigEvt(this,'clickOpen:open');
    });
    
    
    // event
    ael(this,'clickOpen:triggerClick',function(clickEvent) {
        if($option.triggerToggle === true && trigHdlr(this,'clickOpen:isOpen'))
        trigEvt(this,'clickOpen:close');
        else
        trigHdlr(this,'clickOpen:triggerClickOpen');
    });
    
    ael(this,'clickOpen:closed',function() {
        const trigger = trigHdlr(this,'clickOpen:getTrigger');
        $(trigger).focus();
    });
    
    
    // setup
    aelOnce(this,'component:setup',function(event) {
        const $this = this;
        const trigger = trigHdlr(this,'clickOpen:getTrigger');
        
        if(trigger != null)
        {
            ael(trigger,$option.triggerEvent,function(event) {
                trigEvt($this,'clickOpen:triggerClick',event);
                Evt.preventStop(event);
                return false;
            });
            
            aelDelegate(trigger,'click','a',function(event) {
                trigHdlr(document,'history:event',event);
            });
        }
    });
    
    return this;
}