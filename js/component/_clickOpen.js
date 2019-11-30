/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpen
// gère les comportements pour un élément clickOpen y compris le escape et outside click
quid.component.clickOpen = function(target)
{   
    quid.component.clickOutside.call(this,'clickOpen:close');
    quid.component.clickOpenBase.call(this,target);
    
    $(this).on('clickOpen:prepare', function(event) {
        event.stopPropagation();
        var $this = $(this);
        var container = $(this).triggerHandler('clickOpen:getTarget');
        
        quid.component.keyboardEnter.call(container,true);
        
        container.on('click', 'a', function(event) {
            event.stopPropagation();
            $(document).trigger('document:clickEvent',[event]);
        })
        .on('enter:blocked', function(event,keyEvent) {
            var target = $(keyEvent.target);
            var tagName = quid.node.tag(target);
            if(tagName === 'a' || tagName === 'button')
            target.trigger('click');
        })
        .on('click', function(event) {
            event.stopPropagation();
            var attr = $this.triggerHandler('clickOpen:getAttr');
            $(this).find("["+attr+"='1']").trigger('clickOpen:close');
        })
    })
    .trigger('clickOpen:prepare');
    
    return this;
}