/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// feedSearch
// component for a feed with search and order tools
const FeedSearch = Component.FeedSearch = function(option)
{
    // option
    const $option = Object.assign({
        result: '.results',
        search: "input[type='text']",
        order: ".order select"
    },option);
    
    
    // components
    Component.Feed.call(this);
    
    
    // func
    setFunc(this,'feedSearch:getResult',function() {
        return qs(this,$option.result);
    });
    
    setFunc(this,'feedSearch:getSearch',function() {
        return qs(this,$option.search);
    });
    
    setFunc(this,'feedSearch:getSearchValue',function() {
        return triggerFunc(triggerFunc(this,'feedSearch:getSearch'),'input:getValueTrim');
    });
    
    setFunc(this,'feedSearch:getOrder',function() {
        return qs(this,$option.order);
    });

    setFunc(this,'feedSearch:getOrderValue',function() {
        return triggerFunc(triggerFunc(this,'feedSearch:getOrder'),'input:getValueInt');
    });
    
    setFunc(this,'feed:getTarget',function() {
        return triggerFunc(this,'feedSearch:getResult');
    });
    
    /*
    target.on('feed:loadMoreRemove',function(event,loadMore) {
        return loadMore.parent('li');
    })
    .on('feed:target',function(event) {
        return $(this).find(".results ul:last-child");
    })
    .on('feed:parseData',function(event,data) {
        return Html.parse(data).find("ul:last-child li");
    });
    */
    
    setFunc(this,'ajaxBlock:setContent',function(html,isError) {
        triggerFunc(this,'feed:overwrite',html);
    });
    
    setFunc(this,'ajax:config',function() {
        const separator = $(this).data('separator');
        const search = triggerFunc(this,'feedSearch:getSearchValue');
        const order = triggerFunc(this,'feedSearch:getOrderValue') || separator;
        
        return Dom.dataHrefReplaceChar(this,order);
    });
    
    
    // event
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        
    });
    
    
    /*
    .on('ajax:getHref',function(event) {
        
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
        triggerEvent(this,'block');
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
        triggerEvent(this,'unblock');
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
            triggerEvent(this,'ajax:input');
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
        triggerEvent(this,'ajax:init');
    })
    .on('clickOpen:close',function(event) {
        triggerFunc(this,'filter:getResult').html("");
    })
    */
    
    return this;
}