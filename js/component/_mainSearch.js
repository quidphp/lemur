/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// mainSearch
// script with logic for the main search component of the CMS
Component.mainSearch = function()
{
    // clickOpen
    Component.clickOpenInputFormAjax.call(this);
    
    // triggerHandler
    $(this).on('mainSearch:getSearchIn', function() {
        return $(this).find(".search-in");
    })
    
    // setup
    .one('component:setup', function() {
        bindClickOpen.call(this);
        bindSearchIn.call(this);
    });
    
    // bindClickOpen
    const bindClickOpen = function() {
        const searchIn = triggerFunc(this,'mainSearch:getSearchIn');
        
        $(this).on('inputForm:empty', function() {
            searchIn.trigger('clickOpen:open');
        })
        .on('inputForm:notEmpty escape:blocked', function() {
            searchIn.trigger('clickOpen:close');
        });
    };
    
    // bindSearchIn
    const bindSearchIn = function() {
        const $this = $(this);
        const searchIn = triggerFunc(this,'mainSearch:getSearchIn');
        
        Component.clickOpen.call(searchIn,true);
        searchIn.on('clickOpen:open', function() {
            $this.addClass('active-search-in');
        })
        .on('clickOpen:close', function() {
            $this.removeClass('active-search-in');
        });
    };
    
    return this;
}