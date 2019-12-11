/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpen
// manages a clickOpen component, links clickOpenBase and clickOutside
const ClickOpen = Component.ClickOpen = function(option)
{   
    // components
    Component.ClickOutside.call(this,'clickOpen:close');
    Component.ClickOpenBase.call(this,option);
    
    
    // handler
    setHandler(this,'clickOutside:getParent',function() {
        return trigHandler(this,'clickOpen:getParentContainer');
    });
    
    return this;
}