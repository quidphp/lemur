/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpenWithTrigger
// gère les comportements pour un click open avec un trigger
Quid.Component.clickOpenWithTrigger = function(trigger,triggerEvent,target,noToggle)
{
    Quid.Component.clickOpenTrigger.call(this,trigger,triggerEvent,noToggle);
    Quid.Component.clickOpen.call(this,target);
    
    return this;
}