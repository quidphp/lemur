"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// mainSearch
// script with logic for the main search component of the CMS
quid.component.mainSearch = function()
{
    // clickOpen
    quid.core.clickOpenInputFormAjax.call(this);
    
    // triggerHandler
    $(this).on('mainSearch:getSearchIn', function(event) {
        return $(this).find(".search-in");
    })
    
    // setup
    .one('component:setup', function(event) {
        bindClickOpen.call(this);
        bindSearchIn.call(this);
    });
    
    // bindClickOpen
    var bindClickOpen = function() {
        var searchIn = $(this).triggerHandler('mainSearch:getSearchIn');
        
        $(this).on('inputForm:empty', function(event) {
            searchIn.trigger('clickOpen:open');
        })
        .on('inputForm:notEmpty escape:blocked', function(event) {
            searchIn.trigger('clickOpen:close');
        });
    };
    
    // bindSearchIn
    var bindSearchIn = function() {
        var $this = $(this);
        var searchIn = $(this).triggerHandler('mainSearch:getSearchIn');
        
        quid.core.clickOpen.call(searchIn,true);
        searchIn.on('clickOpen:open', function(event) {
            $this.addClass('active-search-in');
        })
        .on('clickOpen:close', function(event) {
            $this.removeClass('active-search-in');
        });
    };
    
    return this;
}