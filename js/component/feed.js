/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// feed
// script of behaviours for a feed component with a load-more button
const Feed = function()
{
    // nodes
    const $nodes = this;
    
    
    // blockEvent + ajax
    Component.BlockEvent.call(this,'ajax:init');
    Component.Ajax.call(this,'ajax:init');
    
    
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
    
    setFunc(this,'ajax:before',function() {
        $(this).attr('data-status','loading');
        triggerFunc(this,'blockEvent:block','ajax:init');
    });
    
    setFunc(this,'ajax:success',function(data,textStatus,jqXHR) {
        triggerFunc(this,'feed:overwrite',data);
    });
    
    setFunc(this,'ajax:error',function(parsedError,jqXHR,textStatus,errorThrown) {
        const target = triggerFunc(this,'feed:getTarget');
        $(this).attr('data-status','error');
        $(target).html(parsedError);
    });
    
    setFunc(this,'ajax:complete',function() {
        $(this).removeAttr('data-status');
    });
    
    
    // event
    ael(this,'feed:bind',function() {
        bindLoadMore.call(this);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        triggerCustom(this,'feed:bind');
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
        
        triggerCustom(this,'feed:bind');
    }
    
    
    // bindLoadMore
    const bindLoadMore = function()
    {
        const $this = this;
        const loadMore = triggerFunc(this,'feed:loadMore');
        
        Component.BlockEvent.call(loadMore,'ajax:init');
        Component.Ajax.call(loadMore,'ajax:init');
        
        setFunc(loadMore,'ajax:before',function() {
            $(this).attr('data-status','loading');
            triggerFunc(this,'blockEvent:block','ajax:init');
        });
        
        setFunc(loadMore,'ajax:success',function(data,textStatus,jqXHR) {
            removeLoadMore.call($this);
            triggerFunc($this,'feed:append',data);
        });
        
        setFunc(loadMore,'ajax:error',function(parsedError,jqXHR,textStatus,errorThrown) {
            removeLoadMore.call($this);
            triggerFunc($this,'ajax:error',parsedError,jqXHR,textStatus);
        });
        
        aelOnce(loadMore,'click',function(event) {
            triggerCustom(this,'ajax:init');
            event.stopPropagation();
            event.preventDefault();
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

// export
Component.Feed = Feed;