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
        trigger: true,
        target: true,
        closeUnsetContent: true
    },option);
    
    
    // components
    Component.FeedSearch.call(this,$option);
    Component.ClickOpenTrigger.call(this,$option);
    
    
    // handler
    setHandler(this,'ajaxBlock:getContentNode',function() {
        return trigHandler(this,'feedSearch:getResult');
    });
    
    setHandler(this,'clickOpen:getTargetContent',function() {
        return trigHandler(this,'feedSearch:getResult');
    });
    
    
    // event
    ael(this,'clickOpen:triggerClick',function(clickEvent) {
        trigHandler(this,'ajax:init');
    });
    
    return this;
}