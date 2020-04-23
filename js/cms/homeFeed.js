/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// homeFeed
// script for feed component with a filter on the CMS home page
Component.HomeFeed = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        filter: {
            trigger: ".trigger",
            target: ".popup",
            background: "tableRelation",
            parse: null,
            closeUnsetContent: false
        }
    },option);
    
    
    // handler
    setHdlrs(this,'homeFeed:',{
        
        getBody: function() {
            return qs(this,".block-body");
        },
        
        getFilter: function() {
            return  qs(this,".block-head .user-relation");
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindFeed.call(this);
        bindFilter.call(this);
    });
    
    
    // bindFeed
    const bindFeed = function() 
    {
        const feed = trigHdlr(this,'homeFeed:getBody');
        trigSetup(Component.Feed.call(feed));
    }
    
    
    // bindFilter
    const bindFilter = function() 
    {
        const $this = this;
        const filter = trigHdlr(this,'homeFeed:getFilter');
        trigSetup(Component.Filter.call(filter,$option.filter));
        
        setHdlr(filter,'homeFeed:getAnchors',function() {
            const result = trigHdlr(this,'feedSearch:getResult');
            if(result != null)
            return qsa(result,'.feed-anchor');
        });
        
        ael(filter,'feed:bind',function() {
            const anchors = trigHdlr(this,'homeFeed:getAnchors');
            bindFilterAnchors.call($this,anchors);
        });
    }
    
    
    // bindFilterAnchors
    const bindFilterAnchors = function(anchors)
    {
        const feed = trigHdlr(this,'homeFeed:getBody');
        const filter = trigHdlr(this,'homeFeed:getFilter');
        
        Component.AjaxBlock.call(anchors,{autoUnbind: true});
        
        setHdlr(anchors,'ajaxBlock:getStatusNode',function(event) {
            return feed;
        });
        
        ael(anchors,'ajaxBlock:before',function() {
            toggleClass(anchors,'selected',false);
            trigEvt(feed,'ajaxBlock:unmountContent');
            toggleClass(this,'selected',true);
        });
        
        ael(anchors,'ajaxBlock:success',function() {
            trigEvt(feed,'feed:bind');
            trigEvt(filter,'clickOpen:close');
        });
    }
    
    return this;
}