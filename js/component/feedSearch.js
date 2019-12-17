/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// feedSearch
// component for a feed with search and order tools
Component.FeedSearch = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        appendTarget: "ul:last-child",
        parseData: null,
        result: '.results',
        search: "input[type='text']",
        order: ".order select",
        inputSearch: {}
    },option);
    
    
    // components
    Component.Feed.call(this);
    
    
    // handler
    setHdlr(this,'feedSearch:getResult',function() {
        return qs(this,$option.result);
    });
    
    setHdlr(this,'feedSearch:getSearch',function() {
        return qs(this,$option.search);
    });
    
    setHdlr(this,'feedSearch:getSearchValue',function() {
        return trigHdlr(trigHdlr(this,'feedSearch:getSearch'),'input:getValueTrim');
    });
    
    setHdlr(this,'feedSearch:getOrder',function() {
        return qs(this,$option.order);
    });

    setHdlr(this,'feedSearch:getOrderValue',function() {
        return trigHdlr(trigHdlr(this,'feedSearch:getOrder'),'input:getValueInt');
    });
    
    setHdlr(this,'feed:getTarget',function() {
        return trigHdlr(this,'feedSearch:getResult');
    });
    
    setHdlr(this,'feed:getAppendTarget',function() {
        const target = trigHdlr(this,'feed:getTarget');
        return qs(target,$option.appendTarget);
    });
    
    setHdlr(this,'feed:loadMoreRemove',function() {
        const loadMore = trigHdlr(this,'feed:loadMore');
        return $(loadMore).parent('li').get(0);
    });
    
    setHdlr(this,'feed:parseData',function(data,type) {
        
        if(type === 'append')
        {
            data = Html.parse(data);
            
            if($option.parseData)
            data = $(data).find($option.parseData).html();
            
            data = $(data).html();
        }
        
        return data;
    });
    
    setHdlr(this,'ajaxBlock:setContent',function(html,isError) {
        trigHdlr(this,'feed:overwrite',html);
    });
    
    setHdlr(this,'ajax:config',function() {
        const separator = getAttr(this,'data-separator');
        const query = getAttr(this,'data-query');
        const search = trigHdlr(this,'feedSearch:getSearchValue');
        const order = trigHdlr(this,'feedSearch:getOrderValue') || separator;
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
        const search = trigHdlr(this,'feedSearch:getSearch');
        
        // components
        Component.InputSearch.call(search,$option.inputSearch);
        
        ael(search,'inputSearch:change',function() {
            trigEvt($this,'ajax:init');
        });
        
        ael(this,'feed:bind',function() {
            trigHdlr(search,'inputSearch:success');
        });
        
        trigSetup(search);
    }
    
    
    // bindOrder
    const bindOrder = function()
    {
        const $this = this;
        const order = trigHdlr(this,'feedSearch:getOrder');
        
        // event
        ael(order,'change',function() {
            trigEvt($this,'ajax:init');
        });
    }
    
    return this;
}