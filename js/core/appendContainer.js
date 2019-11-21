"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// appendContainer
// script of behaviours for an appendContainer component (load more)

// appendContainer
// génère un container qui append avec un bouton loadMore
quid.core.appendContainer = function()
{
    $(this).block('ajax:init').ajax('ajax:init')
    .on('feed:target', function() {
        return $(this);
    })
    .on('feed:parseData', function(event,data) {
        return data;
    })
    .on('feed:append', function(event,data) {
        data = $(this).triggerHandler('feed:parseData',[data]);
        $(this).triggerHandler('feed:target').append(data);
        $(this).trigger('feed:bind');
        $(this).trigger('feed:changed');
    })
    .on('feed:overwrite', function(event,data) {
        data = $(this).triggerHandler('feed:parseData',[data]);
        $(this).triggerHandler('feed:target').html(data);
        $(this).trigger('feed:bind');
        $(this).trigger('feed:changed');
    })
    .on('feed:reload', function(event,uri) {
        if(quid.base.str.isNotEmpty(uri))
        {
            $(this).data("href",uri);
            $(this).trigger('ajax:init');
        }
    })
    .on('feed:loadMore', function(event) {
        return $(this).find(".load-more");
    })
    .on('feed:loadMoreRemove', function(event,loadMore) {
        return loadMore;
    })
    .on('ajax:before', function(event) {
        $(this).attr('data-status','loading');
        $(this).block();
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        $(this).trigger('feed:overwrite',[data]);
    })
    .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
        $(this).attr('data-status','error');
        $(this).triggerHandler('feed:target').html(parsedError);
    })
    .on('ajax:complete', function(event) {
        $(this).removeAttr('data-status');
    })
    .on('feed:bind', function(event) {
        var $this = $(this);
        var loadMore = $(this).triggerHandler('feed:loadMore');
        
        loadMore.off('click').on('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            var remove = $this.triggerHandler('feed:loadMoreRemove',[$(this)]);
            
            $(this).block('ajax:init').ajax('ajax:init').on('ajax:before', function(event) {
                $(this).attr('data-status','loading');
                $(this).block();
            })
            .on('ajax:success', function(event,data,textStatus,jqXHR) {
                remove.remove();
                $this.trigger('feed:append',[data]);
            })
            .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
                remove.remove();
                $this.trigger('ajax:error',[parsedError,jqXHR,textStatus]);
            })
            .trigger('ajax:init');
        });
    });
    
    return this;
}