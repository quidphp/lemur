/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpenWithTrigger
// gère les comportements pour un click open avec un trigger
Component.clickOpenWithTrigger = function(trigger,triggerEvent,target,noToggle)
{
    Component.clickOpenTrigger.call(this,trigger,triggerEvent,noToggle);
    Component.clickOpen.call(this,target);
    
    return this;
}