/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// filter
// gère les comportements complets pour un filtre general avec popup
// appendContainer et vide tout on close
Component.filter = function()
{
    Component.clickOpenWithTrigger.call(this,"> .trigger");
    Component.BlockEvent.call(this,'ajax:init');
    Component.Ajax.call(this,'ajax:init');
    
    $(this).on('filter:getResult',function(event) {
        return $(this).find(".results");
    })
    .on('filter:getInput',function(event) {
        return $(this).find("input[type='text']");
    })
    .on('filter:getOrder',function(event) {
        return $(this).find(".order :input").last();
    })
    .on('ajax:getHref',function(event) {
        const separator = $(this).data('separator');
        const select = triggerFunc(this,'filter:getOrder');
        const selectVal = Dom.value(select,true);
        const order = (select.length && selectVal)? selectVal:separator;
        
        return Dom.dataHrefReplaceChar(this,order);
    })
    .on('ajax:getData',function(event) {
        let r = {};
        const input = triggerFunc(this,'filter:getInput');
        
        r[$(this).data('query')] = Dom.value(input,true);
        
        return r;
    })
    .on('ajax:before',function() {
        triggerCustom(this,'block');
        $(this).attr('data-status','loading');
        triggerFunc(this,'filter:getResult').html("");
    })
    .on('ajax:success',function(event,data,textStatus,jqXHR) {
        triggerFunc(this,'filter:getResult').html(data);
    })
    .on('ajax:error',function(event,parsedError,jqXHR,textStatus,errorThrown) {
        triggerFunc(this,'filter:getResult').html(parsedError);
    })
    .on('ajax:complete',function() {
        triggerCustom(this,'unblock');
        $(this).removeAttr('data-status');
        triggerFunc(this,'filter:getInput').focus();
    })
    .on('filter:bind',function(event) {
        const filter = $(this);
        const input = triggerFunc(this,'filter:getInput');
        const order = triggerFunc(this,'filter:getOrder');
        
        Component.validatePrevent.call(input,'ajax:input');
        Component.Timeout.call(input,'keyup',500);

        input.on('keyup:onTimeout',function(event) {
            triggerCustom(this,'ajax:input');
        })
        .on('ajax:input',function(event) {
            filter.trigger('ajax:init');
        });
        
        order.on('change',function(event) {
            filter.trigger('ajax:init');
        });
    });
    
    $(this).on('ajax:complete',function(event) {
        triggerFunc(this,'clickOpen:getTarget').trigger('feed:bind');
    })
    .on('clickOpen:open',function(event) {
        triggerCustom(this,'ajax:init');
    })
    .on('clickOpen:close',function(event) {
        triggerFunc(this,'filter:getResult').html("");
    })
    .on('component:setup',function(event) {
        triggerCustom(this,'filter:bind');
        
        const target = triggerFunc(this,'clickOpen:getTarget');
        Component.appendContainer.call(target);
        
        target.on('feed:loadMoreRemove',function(event,loadMore) {
            return loadMore.parent('li');
        })
        .on('feed:target',function(event) {
            return $(this).find(".results ul:last-child");
        })
        .on('feed:parseData',function(event,data) {
            return Html.parse(data).find("ul:last-child li");
        });
    });
    
    return this;
}