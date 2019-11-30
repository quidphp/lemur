/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// mainSearch
// script with logic for the main search component of the CMS
Quid.Component.mainSearch = function()
{
    // clickOpen
    Quid.Component.clickOpenInputFormAjax.call(this);
    
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
    var bindClickOpen = function() {
        var searchIn = $(this).triggerHandler('mainSearch:getSearchIn');
        
        $(this).on('inputForm:empty', function() {
            searchIn.trigger('clickOpen:open');
        })
        .on('inputForm:notEmpty escape:blocked', function() {
            searchIn.trigger('clickOpen:close');
        });
    };
    
    // bindSearchIn
    var bindSearchIn = function() {
        var $this = $(this);
        var searchIn = $(this).triggerHandler('mainSearch:getSearchIn');
        
        Quid.Component.clickOpen.call(searchIn,true);
        searchIn.on('clickOpen:open', function() {
            $this.addClass('active-search-in');
        })
        .on('clickOpen:close', function() {
            $this.removeClass('active-search-in');
        });
    };
    
    return this;
}