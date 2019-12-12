/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpen
// manages a clickOpen component, links clickOpenBase and clickOutside
const ClickOpen = Component.ClickOpen = function(option)
{   
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // components
    Component.ClickOutside.call(this,'clickOpen:close');
    Component.ClickOpenBase.call(this,option);
    
    
    // handler
    setHdlr(this,'clickOutside:getParent',function() {
        return trigHdlr(this,'clickOpen:getParentOrRoot');
    });
    
    return this;
}