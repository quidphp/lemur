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
        order: ".order select",
        inputSearch: {}
    },option);
    
    
    // components
    Component.Feed.call(this);
    
    
    // handler
    setHandler(this,'feedSearch:getResult',function() {
        return qs(this,$option.result);
    });
    
    setHandler(this,'feedSearch:getSearch',function() {
        return qs(this,$option.search);
    });
    
    setHandler(this,'feedSearch:getSearchValue',function() {
        return trigHandler(trigHandler(this,'feedSearch:getSearch'),'input:getValueTrim');
    });
    
    setHandler(this,'feedSearch:getOrder',function() {
        return qs(this,$option.order);
    });

    setHandler(this,'feedSearch:getOrderValue',function() {
        return trigHandler(trigHandler(this,'feedSearch:getOrder'),'input:getValueInt');
    });
    
    setHandler(this,'feed:getTarget',function() {
        return trigHandler(this,'feedSearch:getResult');
    });
    
    setHandler(this,'feed:getAppendTarget',function() {
        const target = trigHandler(this,'feed:getTarget');
        return qs(target,'ul:last-child');
    });
    
    setHandler(this,'feed:loadMoreRemove',function() {
        const loadMore = trigHandler(this,'feed:loadMore');
        return $(loadMore).parent('li').get(0);
    });
    
    setHandler(this,'feed:parseData',function(data,type) {
        if(type === 'append')
        {
            data = Html.parse(data);
            data = $(data).find("ul:last-child").html();
        }
        
        return data;
    });
    
    setHandler(this,'ajaxBlock:setContent',function(html,isError) {
        trigHandler(this,'feed:overwrite',html);
    });
    
    setHandler(this,'ajax:config',function() {
        const separator = $(this).data('separator');
        const query = $(this).data('query');
        const search = trigHandler(this,'feedSearch:getSearchValue');
        const order = trigHandler(this,'feedSearch:getOrderValue') || separator;
        const data = {};
        data[query] = search;
        
        return {
            url: Dom.dataHrefReplaceChar(this,order),
            data: data
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindSearch.call(this);
        bindOrder.call(this);
    });
    
    
    // bindSearch
    const bindSearch = function()
    {
        const $this = this;
        const search = trigHandler(this,'feedSearch:getSearch');
        
        // components
        Component.InputSearch.call(search,$option.inputSearch);
        
        ael(search,'inputSearch:change',function() {
            trigEvt($this,'ajax:init');
        });
        
        ael(this,'feed:bind',function() {
            const searchValue = trigHandler(this,'feedSearch:getSearchValue');
            trigHandler(search,'inputSearch:setCurrent',searchValue);
        });
        
        trigSetup(search);
    }
    
    
    // bindOrder
    const bindOrder = function()
    {
        const $this = this;
        const order = trigHandler(this,'feedSearch:getOrder');
        
        // event
        ael(order,'change',function() {
            trigEvt($this,'ajax:init');
        });
    }
    
    return this;
}