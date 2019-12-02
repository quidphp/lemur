/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenAnchorAjax
// génère un lien en ajax dont le contenu s'affiche dans un clickOpen
Component.clickOpenAnchorAjax = function(trigger,target) 
{
    $(this).each(function(index, el) {
        const anchor = $(this).find("a");
        trigger = trigger || 'a';
        
        $(this).on('ajax:getHref',function(event) {
            return triggerFunc(this,'clickOpen:getTrigger').prop('href');
        });
        
        Component.clickOpenAjax.call(this,'click',true,target);
        Component.clickOpenTrigger.call(this,trigger,'click');
        
        anchor.on('click',function(event) {
            event.preventDefault();
        });
    });
    
    return this;
}