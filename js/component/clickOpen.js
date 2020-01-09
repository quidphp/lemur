/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickOpen
// manages a clickOpen component, links clickOpenBase and clickOutside
Component.ClickOpen = function(option)
{   
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        clickOutsidePersistent: false
    },option);
    
    
    // components
    Component.ClickOutside.call(this,'clickOpen:close',$option.clickOutsidePersistent);
    Component.ClickOpenBase.call(this,$option);
    
    
    // handler
    setHdlr(this,'clickOutside:getParent',function() {
        return trigHdlr(this,'clickOpen:getParentOrRoot');
    });
    
    return this;
}