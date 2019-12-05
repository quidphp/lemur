/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// ClickOpenTrigger
// manages a clickOpen component which has a trigger
const ClickOpenTrigger = function(option)
{
    // nodes
    const $nodes = this;
    
    
    // clickOpenTriggerBase + clickOpen
    Component.ClickOpenTriggerBase.call(this,option);
    Component.ClickOpen.call(this,option);
    
    return this;
}

// export
Component.ClickOpenTrigger = ClickOpenTrigger;