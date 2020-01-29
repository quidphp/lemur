/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// filter
// component for a clickOpen filter component which has a page feed, search and order tools
Component.Filter = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        trigger: true,
        target: true,
        closeUnsetContent: true,
        focusableTarget: "a:not(.load-more)",
        parseData: "ul:last-of-type"
    },option);
    
    
    // components
    Component.FeedSearch.call(this,$option);
    Component.ClickOpenTrigger.call(this,$option);
    
    
    // handler
    setHdlr(this,'ajaxBlock:getContentNode',function() {
        return trigHdlr(this,'feedSearch:getResult');
    });
    
    setHdlr(this,'clickOpen:getTargetContent',function() {
        return trigHdlr(this,'feedSearch:getResult');
    });
    
    setHdlr(this,'clickOpen:getTargetFocus',function() {
        return trigHdlr(this,'feedSearch:getSearch') || trigHdlr(this,'clickOpen:getTarget');
    });
    
    
    // event
    ael(this,'clickOpen:triggerClick',function(clickEvent) {
        trigHdlr(this,'ajax:init');
    });
    
    return this;
}