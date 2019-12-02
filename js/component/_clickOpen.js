/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpen
// gère les comportements pour un élément clickOpen y compris le escape et outside click
Component.clickOpen = function(target)
{   
    Component.clickOutside.call(this,'clickOpen:close');
    Component.clickOpenBase.call(this,target);
    
    $(this).on('clickOpen:prepare',function(event) {
        event.stopPropagation();
        const $this = $(this);
        const container = triggerFunc(this,'clickOpen:getTarget');
        
        Component.keyboardEnter.call(container,true);
        
        container.on('click', 'a',function(event) {
            event.stopPropagation();
            $(document).trigger('document:clickEvent',[event]);
        })
        .on('enter:blocked',function(event,keyEvent) {
            const target = $(keyEvent.target);
            const tagName = Dom.tag(target);
            if(tagName === 'a' || tagName === 'button')
            target.trigger('click');
        })
        .on('click',function(event) {
            event.stopPropagation();
            const attr = $this.triggerHandler('clickOpen:getAttr');
            $(this).find("["+attr+"='1']").trigger('clickOpen:close');
        })
    })
    .trigger('clickOpen:prepare');
    
    return this;
}