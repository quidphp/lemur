/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// filter
// component for a clickOpen filter component which has a page feed, search and order tools
const Filter = Component.Filter = function(option)
{
    // option
    const $option = Object.assign({
        trigger: ".trigger",
        target: ".popup"
    },option);
    
    
    // components
    Component.FeedSearch.call(this,$option);
    Component.ClickOpenTrigger.call(this,$option);
    
    
    // func
    
    
    // event
    ael(this,'clickOpen:triggerClick',function(clickEvent) {
        triggerFunc(this,'ajax:init');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        
    });
    
    
    return this;
}