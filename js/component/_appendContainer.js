/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// appendContainer
// script of behaviours for an appendContainer component (load more)
Component.appendContainer = function()
{
    Component.block.call(this,'ajax:init');
    Component.Ajax.call(this,'ajax:init');
    
    $(this).on('feed:target',function() {
        return $(this);
    })
    .on('feed:parseData',function(event,data) {
        return data;
    })
    .on('feed:append',function(event,data) {
        data = triggerFunc(this,'feed:parseData',data);
        triggerFunc(this,'feed:target').append(data);
        triggerCustom(this,'feed:bind');
        triggerCustom(this,'feed:changed');
    })
    .on('feed:overwrite',function(event,data) {
        data = triggerFunc(this,'feed:parseData',data);
        triggerFunc(this,'feed:target').html(data);
        triggerCustom(this,'feed:bind');
        triggerCustom(this,'feed:changed');
    })
    .on('feed:reload',function(event,uri) {
        if(Str.isNotEmpty(uri))
        {
            $(this).data("href",uri);
            triggerCustom(this,'ajax:init');
        }
    })
    .on('feed:loadMore',function(event) {
        return $(this).find(".load-more");
    })
    .on('feed:loadMoreRemove',function(event,loadMore) {
        return loadMore;
    })
    .on('ajax:before',function(event) {
        $(this).attr('data-status','loading');
        triggerCustom(this,'block');
    })
    .on('ajax:success',function(event,data,textStatus,jqXHR) {
        triggerCustom(this,'feed:overwrite',data);
    })
    .on('ajax:error',function(event,parsedError,jqXHR,textStatus,errorThrown) {
        $(this).attr('data-status','error');
        triggerFunc(this,'feed:target').html(parsedError);
    })
    .on('ajax:complete',function(event) {
        $(this).removeAttr('data-status');
    })
    .on('feed:bind',function(event) {
        const $this = $(this);
        const loadMore = triggerFunc(this,'feed:loadMore');
        
        loadMore.off('click').on('click',function(event) {
            event.stopPropagation();
            event.preventDefault();
            const remove = $this.triggerHandler('feed:loadMoreRemove',[$(this)]);
            
            Component.block.call(this,'ajax:init');
            Component.Ajax.call(this,'ajax:init');
            
            $(this).on('ajax:before',function(event) {
                $(this).attr('data-status','loading');
                triggerCustom(this,'block');
            })
            .on('ajax:success',function(event,data,textStatus,jqXHR) {
                remove.remove();
                $this.trigger('feed:append',[data]);
            })
            .on('ajax:error',function(event,parsedError,jqXHR,textStatus,errorThrown) {
                remove.remove();
                $this.trigger('ajax:error',[parsedError,jqXHR,textStatus]);
            })
            .trigger('ajax:init');
        });
    });
    
    return this;
}