/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// filter
// gère les comportements complets pour un filtre general avec popup
// appendContainer et vide tout on close
Quid.Component.filter = function()
{
    Quid.Component.clickOpenWithTrigger.call(this,"> .trigger");
    Quid.Component.block.call(this,'ajax:init');
    Quid.Component.ajax.call(this,'ajax:init');
    
    $(this).on('filter:getResult', function(event) {
        return $(this).find(".results");
    })
    .on('filter:getInput', function(event) {
        return $(this).find("input[type='text']");
    })
    .on('filter:getOrder', function(event) {
        return $(this).find(".order :input").last();
    })
    .on('ajax:getHref', function(event) {
        var separator = $(this).data('separator');
        var select = $(this).triggerHandler('filter:getOrder');
        var selectVal = Quid.Node.value(select,true);
        var order = (select.length && selectVal)? selectVal:separator;
        
        return Quid.Node.dataHrefReplaceChar(this,order);
    })
    .on('ajax:getData', function(event) {
        var r = {};
        var input = $(this).triggerHandler('filter:getInput');
        
        r[$(this).data('query')] = Quid.Node.value(input,true);
        
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
    .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
        $(this).triggerHandler('filter:getResult').html(parsedError);
    })
    .on('ajax:complete', function() {
        $(this).trigger('unblock');
        $(this).removeAttr('data-status');
        $(this).triggerHandler('filter:getInput').focus();
    })
    .on('filter:bind', function(event) {
        var filter = $(this);
        var input = $(this).triggerHandler('filter:getInput');
        var order = $(this).triggerHandler('filter:getOrder');
        
        Quid.Component.validatePrevent.call(input,'ajax:input');
        Quid.Component.timeout.call(input,'keyup',500);

        input.on('keyup:onTimeout', function(event) {
            $(this).trigger('ajax:input');
        })
        .on('ajax:input', function(event) {
            filter.trigger('ajax:init');
        });
        
        order.on('change',function(event) {
            filter.trigger('ajax:init');
        });
    });
    
    $(this).on('ajax:complete', function(event) {
        $(this).triggerHandler('clickOpen:getTarget').trigger('feed:bind');
    })
    .on('clickOpen:open', function(event) {
        $(this).trigger('ajax:init');
    })
    .on('clickOpen:close', function(event) {
        $(this).triggerHandler('filter:getResult').html("");
    })
    .on('component:setup', function(event) {
        $(this).trigger('filter:bind');
        
        var target = $(this).triggerHandler('clickOpen:getTarget');
        Quid.Component.appendContainer.call(target);
        
        target.on('feed:loadMoreRemove', function(event,loadMore) {
            return loadMore.parent('li');
        })
        .on('feed:target', function(event) {
            return $(this).find(".results ul:last-child");
        })
        .on('feed:parseData', function(event,data) {
            return Quid.Html.parse(data).find("ul:last-child li");
        });
    });
    
    return this;
}