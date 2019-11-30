/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenAnchorAjax
// génère un lien en ajax dont le contenu s'affiche dans un clickOpen
quid.component.clickOpenAnchorAjax = function(trigger,target) 
{
    $(this).each(function(index, el) {
        var anchor = $(this).find("a");
        trigger = trigger || 'a';
        
        $(this).on('ajax:getHref', function(event) {
            return $(this).triggerHandler('clickOpen:getTrigger').prop('href');
        });
        
        quid.component.clickOpenAjax.call(this,'click',true,target);
        quid.component.clickOpenTrigger.call(this,trigger,'click');
        
        anchor.on('click', function(event) {
            event.preventDefault();
        });
    });
    
    return this;
}