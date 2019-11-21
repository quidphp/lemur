"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// mainSearch
// script with logic for the main search component of the CMS
quid.cms.mainSearch = function()
{
    $(this).each(function(index, el) {
        var $this = $(this);
        var searchIn = $(this).find(".search-in");

        quid.core.clickOpen.call(searchIn,true);
        searchIn.on('clickOpen:open', function(event) {
            $this.addClass('active-search-in');
        })
        .on('clickOpen:close', function(event) {
            $this.removeClass('active-search-in');
        });
        
        quid.core.clickOpenInputFormAjax.call(this);
        $(this).on('inputForm:empty', function(event) {
            searchIn.trigger('clickOpen:open');
        })
        .on('inputForm:notEmpty escape:blocked', function(event) {
            searchIn.trigger('clickOpen:close');
        });
    });
    
    return this;
}