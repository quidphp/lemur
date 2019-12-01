/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpenTrigger
// gère les comportements pour le trigger d'un élément clickOpen
Component.clickOpenTrigger = function(trigger,triggerEvent,noToggle)
{
    triggerEvent = Str.isNotEmpty(triggerEvent)? triggerEvent:"click";

    $(this).on('clickOpen:getTrigger', function(event) {
        let r = $(this);
        
        if(Str.isNotEmpty(trigger))
        r = $(this).find(trigger);
        
        return r;
    })
    .on('clickOpen:prepare', function(event) {
        event.stopPropagation();
        const $this = $(this);
        const trigger = triggerFunc(this,'clickOpen:getTrigger');
        
        if(trigger.length)
        {
            trigger.on('click', 'a', function(event) {
                event.stopPropagation();
                $(document).trigger('document:clickEvent',[event]);
            })
            .on(triggerEvent, function(event) {
                event.stopPropagation();
                event.preventDefault();
                
                $this.trigger((noToggle === true)? 'clickOpen:open':'clickOpen:toggle'); // temp, fix it
            });
        }
    });
    
    return this;
}