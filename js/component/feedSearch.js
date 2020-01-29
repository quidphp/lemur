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
        appendTarget: "ul:last-of-type",
        focusableTarget: "button",
        parseData: null,
        result: '.results',
        search: "input[type='text']",
        order: ".order select",
        inputSearch: {}
    },option);
    
    
    // components
    Component.Feed.call(this);
    Component.HrefReplaceChar.call(this);
    Component.Focusable.call(this);
    Component.KeyboardArrow.call(this,'vertical');
    
    
    // handler
    setHdlrs(this,'feedSearch:',{
        
        getResult: function() {
            return qs(this,$option.result);
        },
        
        getSearch: function() {
            return qs(this,$option.search);
        },
        
        getSearchValue: function() {
            return trigHdlr(trigHdlr(this,'feedSearch:getSearch'),'input:getValueTrim');
        },
        
        getOrder: function() {
            return qs(this,$option.order);
        },
        
        getOrderValue: function() {
            return trigHdlr(trigHdlr(this,'feedSearch:getOrder'),'input:getValueInt');
        }
    });
    
    setHdlrs(this,'feed:',{
        
        getTarget: function() {
            return trigHdlr(this,'feedSearch:getResult');
        },
        
        getAppendTarget: function() {
            const target = trigHdlr(this,'feed:getTarget');
            return qs(target,$option.appendTarget);
        },
        
        loadMoreRemove: function() {
            const loadMore = trigHdlr(this,'feed:loadMore');
            return Nod.closest(loadMore,'li');
        },
        
        parseData: function(data,type) {
            
            if(type === 'append')
            {
                data = Dom.parseOne(data);
                
                if($option.parseData)
                data = qs(data,$option.parseData);
                
                data = getHtml(data);
            }
            
            return data;
        }
    });
    
    setHdlr(this,'focusable:getTargets',function() {
        const result = trigHdlr(this,'feedSearch:getResult');
        return qsa(result,$option.focusableTarget);
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
            url: trigHdlr(this,'hrefReplaceChar:make',order),
            data: data
        }
    });
    
    
    // event
    ael(this,'keyboardArrow:down',function() {
        trigHdlr(this,'focusable:next');
    });
    
    ael(this,'keyboardArrow:up',function() {
        trigHdlr(this,'focusable:prev');
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
        
        
        // event
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