/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpen
// manages a clickOpen component, links clickOpenBase and clickOutside
const ClickOpen = function(option)
{   
    // nodes
    const $nodes = this;
    
    
    // components
    Component.ClickOutside.call(this,'clickOpen:close');
    Component.ClickOpenBase.call(this,option);
    
    
    // func
    setFunc(this,'clickOutside:getParent',function() {
        return triggerFunc(this,'clickOpen:getParentContainer');
    });
    
    return this;
}

// export
Component.ClickOpen = ClickOpen;