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
    Component.AjaxBlock.call(this,{ajaxEvent: 'ajax:init'});
    
    
    // handler
    setHandler(this,'feed:getTarget',function() {
        return this;
    });
    
    setHandler(this,'feed:getAppendTarget',function() {
        return this;
    });
    
    setHandler(this,'feed:parseData',function(data,type) {
        return data;
    });
    
    setHandler(this,'feed:loadMore',function() {
        return qs(this,'.load-more');
    });
    
    setHandler(this,'feed:loadMoreRemove',function() {
        return trigHandler(this,'feed:loadMore');
    })
    
    setHandler(this,'feed:append',function(data) {
        feedSet.call(this,'append',data);
    });
    
    setHandler(this,'feed:overwrite',function(data) {
        feedSet.call(this,'overwrite',data);
    });
    
    
    // event
    ael(this,'feed:bind',function() {
        bindLoadMore.call(this);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        trigEvt(this,'feed:bind');
    });

    
    // feedSet
    const feedSet = function(type,data)
    {
        data = trigHandler(this,'feed:parseData',data,type);
        
        if(type === 'append')
        {
            const target = trigHandler(this,'feed:getAppendTarget');
            $(target).append(data);
        }
        
        else
        {
            const target = trigHandler(this,'feed:getTarget');
            $(target).html(data);
        }
        
        trigEvt(this,'feed:bind');
    }
    
    
    // bindLoadMore
    const bindLoadMore = function()
    {
        const $this = this;
        const loadMore = trigHandler(this,'feed:loadMore');
        Component.AjaxBlock.call(loadMore,{ajaxEvent: 'ajax:init'});
        
        setHandler(loadMore,'ajaxBlock:setContent',function(html,isError) {
            removeLoadMore.call($this);
            trigHandler($this,(isError === true)? 'feed:overwrite':'feed:append',html);
        });
        
        aelOnce(loadMore,'click',function(event) {
            trigEvt(this,'ajax:init');
            Evt.preventStop(event);
        });
        
        // removeLoadMore
        const removeLoadMore = function()
        {
            const node = trigHandler(this,'feed:loadMoreRemove');
            $(node).remove();
        }
    }
    
    return this;
}