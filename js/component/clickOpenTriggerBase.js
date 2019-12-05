/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// ClickOpenTriggerBase
// grants base functions for a clickOpen component which has a trigger to open/close
const ClickOpenTriggerBase = function(option)
{
    // nodes
    const $nodes = this;
    
    
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
    
    
    // setup
    aelOnce(this,'component:setup',function(event) {
        const $this = this;
        const trigger = triggerFunc(this,'clickOpen:getTrigger');
        
        if(trigger != null)
        {
            ael(trigger,$option.triggerEvent,function(event) {
                if($option.triggerToggle === true)
                triggerFunc($this,'clickOpen:toggle');
                else
                triggerCustom($this,'clickOpen:open');
                
                event.stopPropagation();
                event.preventDefault();
            });
            
            aelDelegate(trigger,'click','a',function(event) {
                triggerFunc(document,'doc:clickEvent',event);
                event.stopPropagation();
            })
            
        }
    });
    
    return this;
}

// export
Component.ClickOpenTriggerBase = ClickOpenTriggerBase;