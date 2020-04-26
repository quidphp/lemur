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
    
    
    // handler
    setHdlrs(this,'homeFeed:',{
        
        getBody: function() {
            return qs(this,".block-body");
        },
        
        getFilter: function() {
            return qs(this,".block-head .user-relation");
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
        const feed = trigHdlr(this,'homeFeed:getBody');
        const filter = trigHdlr(this,'homeFeed:getFilter');
        Component.FeedFilter.call(filter);
        
        setHdlr(filter,'feedFilter:getTargetFeed',function() {
            return feed;
        });
        
        trigSetup(filter);
    }
    
    return this;
}