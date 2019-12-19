/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// tabs
// script with behaviours for a tabs component
Component.Tabs = function(option) 
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        target: [],
        attr: 'data-tab',
        loop: false,
        child: 'tab',
        childActive: 'isOpen',
        type: 'tabs'
    },option);
    
    
    // components
    Component.NavIndex.call(this,$option);
    
    return this;
}