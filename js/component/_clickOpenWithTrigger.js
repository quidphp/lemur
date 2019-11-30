/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpenWithTrigger
// gère les comportements pour un click open avec un trigger
quid.component.clickOpenWithTrigger = function(trigger,triggerEvent,target,noToggle)
{
    quid.component.clickOpenTrigger.call(this,trigger,triggerEvent,noToggle);
    quid.component.clickOpen.call(this,target);
    
    return this;
}