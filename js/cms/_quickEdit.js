"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// quickEdit
// script for the quickEdit component in the general page of the CMS
quid.cms.quickEdit = function()
{
    var $all = $(this);
    
    // setForm
    function setForm(data) 
    {
        if(quid.base.isStringNotEmpty(data))
        {
            var inDiv = $(this).triggerHandler('quickEdit:getIn');
            inDiv.html(data);
            $(document).trigger('document:commonBindings',[inDiv]).trigger('specific:formPrepare',[inDiv]);
            $all.not($(this)).trigger('quickEdit:revert');
        }
    }
    
    $(this).ajaxBlock('click')
    .on('ajaxBlock:getStatusNode', function(event) {
        return $(this).triggerHandler('quickEdit:getTd');
    })
    .on('ajax:before', function(event) {
        $(this).trigger('quickEdit:prepareRevert');
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        setForm.call(this,data);
    })
    .on('quickEdit:getTd', function(event) {
        return $(this).parents("td").first();
    })
    .on('quickEdit:getIn', function(event) {
        return $(this).triggerHandler('quickEdit:getTd').find(".in");
    })
    .on('quickEdit:prepareRevert', function(event) {
        if(!$(this).data('quickEdit:revert'))
        {
            var inDiv = $(this).triggerHandler('quickEdit:getIn');
            var html = inDiv.html();
            $(this).data('quickEdit:revert',html);
        }
    })
    .on('quickEdit:revert', function(event) {
        var html = $(this).data('quickEdit:revert');
        
        if(html != null)
        {
            var inDiv = $(this).triggerHandler('quickEdit:getIn');
            $(this).triggerHandler('ajaxBlock:getStatusNode').removeAttr('data-status');
            inDiv.html(html);
        }
    })
    .on('quickEdit:bind', function(event) {
        var $this = $(this);
        
        $(this).triggerHandler('quickEdit:getIn').on('click', '> form > .tools .reset', function(event) {
            $this.trigger('quickEdit:revert');
        });
    })
    .trigger('quickEdit:bind');
    
    return this;
}