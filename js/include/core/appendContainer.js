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
quid.core.appendContainer = $.fn.appendContainer = function()
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
        if(quid.base.isStringNotEmpty(uri))
        {
            $(this).data("href",uri);
            $(this).trigger('ajax:init');
        }
    })
    .on('feed:error', function(event,jqXHR,textStatus) {
        $(this).attr('data-status','error');
        $(this).triggerHandler('feed:target').html(quid.main.parseError(jqXHR,textStatus));
    })
    .on('ajax:before', function(event) {
        $(this).attr('data-status','loading');
        $(this).block();
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        $(this).trigger('feed:overwrite',[data]);
    })
    .on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
        $(this).trigger('feed:error',[jqXHR,textStatus]);
    })
    .on('ajax:complete', function(event) {
        $(this).removeAttr('data-status');
    })
    .on('feed:bind', function(event) {
        var parent = $(this);
        
        $(this).find('.load-more').off('click').on('click', function(event) {
            event.stopPropagation();
            
            $(this).block('ajax:init').ajax('ajax:init').on('ajax:before', function(event) {
                $(this).attr('data-status','loading');
                $(this).block();
            })
            .on('ajax:success', function(event,data,textStatus,jqXHR) {
                parent.trigger('feed:append',[data]);
                $(this).remove();
            })
            .on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
                parent.trigger('feed:error',[jqXHR,textStatus]);
                $(this).remove();
            }).trigger('ajax:init');
        });
    }).trigger('feed:bind');
    
    return this;
}