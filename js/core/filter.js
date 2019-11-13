"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// filter
// script for a search filter component

// filterGeneral
// gère les comportements pour un filtre avec popup
quid.core.filterGeneral = $.fn.filterGeneral = function()
{
    $(this).block('ajax:init').ajax('ajax:init')
    .on('filter:getResult', function(event) {
        return $(this).find(".results");
    })
    .on('filter:getInput', function(event) {
        return $(this).find("input[type='text']");
    })
    .on('filter:getOrder', function(event) {
        return $(this).find(".order :input").last();
    })
    .on('filter:prepare', function(event) {
        var filter = $(this);
        
        $(this).triggerHandler('filter:getInput').validatePrevent('ajax:input').timeout('keyup',500)
        .on('keyup:onTimeout', function(event) {
            $(this).trigger('ajax:input');
        })
        .on('ajax:input', function(event) {
            filter.trigger('ajax:init');
        });
        
        $(this).triggerHandler('filter:getOrder').on('change',function(event) {
            filter.trigger('ajax:init');
        });
    })
    .on('ajax:getHref', function(event) {
        var separator = $(this).data('separator');
        var select = $(this).triggerHandler('filter:getOrder');
        var selectVal = select.inputValue(true);
        var order = (select.length && selectVal)? selectVal:separator;
        return $(this).dataHrefReplaceChar(order);
    })
    .on('ajax:getData', function(event) {
        var r = {};
        r[$(this).data('query')] = $(this).triggerHandler('filter:getInput').inputValue(true);
        return r;
    })
    .on('ajax:before', function() {
        $(this).trigger('block');
        $(this).attr('data-status','loading');
        $(this).triggerHandler('filter:getResult').html("");
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        $(this).triggerHandler('filter:getResult').html(data);
    })
    .on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
        $(this).triggerHandler('filter:getResult').html(quid.core.parseError(jqXHR,textStatus));
    })
    .on('ajax:complete', function() {
        $(this).trigger('unblock');
        $(this).removeAttr('data-status');
        $(this).triggerHandler('filter:getInput').focus();
    }).trigger('filter:prepare');
    
    return this;
}


// filterGeneralFull
// gère les comportements complets pour un filtre general avec popup
// appendContainer et vide tout on close
quid.core.filterGeneralFull = $.fn.filterGeneralFull = function()
{
    $(this).clickOpenWithTrigger("> .trigger").filterGeneral();
            
    $(this).each(function(index, el) {
        $(this).on('ajax:complete', function(event) {
            $(this).triggerHandler('clickOpen:getTarget').trigger('feed:bind');
        })
        .triggerHandler('clickOpen:getTarget').appendContainer().on('feed:target', function(event) {
            return $(this).find("ul:last-child");
        })
        .on('feed:parseData', function(event,data) {
            return quid.core.parseHtmlDocument(data).find("ul:last-child li");
        });
    });
    
    $(this).on('clickOpen:open', function(event) {
        $(this).trigger('ajax:init');
    })
    .on('clickOpen:close', function(event) {
        $(this).triggerHandler('filter:getResult').html("");
    });
    
    return this;
}