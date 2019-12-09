/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// feed
// script of behaviours for a feed component with a load-more button
const Feed = Component.Feed = function()
{
    // components
    Component.AjaxBlock.call(this,'ajax:init');
    
    
    // func
    setFunc(this,'feed:getTarget',function() {
        return this;
    });
    
    setFunc(this,'feed:parseData',function(data) {
        return data;
    });
    
    setFunc(this,'feed:loadMore',function() {
        return qs(this,'.load-more');
    });
    
    setFunc(this,'feed:loadMoreRemove',function() {
        return triggerFunc(this,'feed:loadMore');
    })
    
    setFunc(this,'feed:append',function(data) {
        feedSet.call(this,'append',data);
    });
    
    setFunc(this,'feed:overwrite',function(data) {
        feedSet.call(this,'overwrite',data);
    });
    
    
    // event
    ael(this,'feed:bind',function() {
        bindLoadMore.call(this);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        triggerEvent(this,'feed:bind');
    });

    
    // feedSet
    const feedSet = function(type,data)
    {
        data = triggerFunc(this,'feed:parseData',data);
        const target = triggerFunc(this,'feed:getTarget');
        
        if(type === 'append')
        $(target).append(data);
        else
        $(target).html(data);
        
        triggerEvent(this,'feed:bind');
    }
    
    
    // bindLoadMore
    const bindLoadMore = function()
    {
        const $this = this;
        const loadMore = triggerFunc(this,'feed:loadMore');
        Component.AjaxBlock.call(loadMore,'ajax:init');
        
        setFunc(loadMore,'ajaxBlock:setContent',function(html,isError) {
            removeLoadMore.call($this);
            triggerFunc($this,(isError === true)? 'feed:overwrite':'feed:append',html);
        });
        
        aelOnce(loadMore,'click',function(event) {
            triggerEvent(this,'ajax:init');
            Evt.preventStop(event);
        });
        
        // removeLoadMore
        const removeLoadMore = function()
        {
            const node = triggerFunc(this,'feed:loadMoreRemove');
            node.remove();
        }
    }
    
    return this;
}