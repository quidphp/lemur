/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// ClickOpenTrigger
// manages a clickOpen component which has a trigger
const ClickOpenTrigger = Component.ClickOpenTrigger = function(option)
{
    // components
    Component.ClickOpenTriggerBase.call(this,option);
    Component.ClickOpen.call(this,option);
    
    return this;
}