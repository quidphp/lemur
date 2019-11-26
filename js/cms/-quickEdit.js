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
    // all cells
    var $that = $(this);
    
    // ajaxBlock
    quid.main.ajax.block.call(this,'click');
    
    // triggerHandler
    $(this).on('quickEdit:isEditing', function(event) {
        return ($(this).triggerHandler('quickEdit:getTdEditing').length)? true:false;
    })
    .on('ajaxBlock:getStatusNode', function(event) {
        return $(this).triggerHandler('quickEdit:getTd');
    })
    .on('quickEdit:getTd', function(event) {
        return $(this).parents("td").first();
    })
    .on('quickEdit:getTdEditing', function(event) {
        return $(this).triggerHandler('quickEdit:getTd').filter("[data-editing='1']");
    })
    .on('quickEdit:getCellInner', function(event) {
        return $(this).triggerHandler('quickEdit:getTd').find("> .cell-inner");
    })
    .on('quickEdit:getGeneralComponent', function(event) {
        return $(this).triggerHandler('quickEdit:getCellInner').find("> .general-component");
    })
    .on('quickEdit:getEditContainer', function(event) {
        return $(this).triggerHandler('quickEdit:getCellInner').find("> .quick-edit-container");
    })
    
    // trigger
    .on('quickEdit:revert', function(event) {
        if($(this).triggerHandler('quickEdit:isEditing'))
        {
            var td = $(this).triggerHandler('quickEdit:getTd');
            var editContainer = $(this).triggerHandler('quickEdit:getEditContainer');
            $(document).trigger('specificForm:unmount',[editContainer]);
            editContainer.html("");
            td.removeAttr('data-editing');
            $(this).trigger('dragScroll:refresh');
        }
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        if(quid.base.str.isNotEmpty(data))
        {
            $that.not($(this)).trigger('quickEdit:revert');
            
            var td = $(this).triggerHandler('quickEdit:getTd');
            td.attr('data-editing',1);
            var editContainer = $(this).triggerHandler('quickEdit:getEditContainer');
            editContainer.html(data);
            $(document).trigger('document:mountCommon',[editContainer]);
            $(document).trigger('specificForm:mount',[editContainer]);
            $(this).trigger('dragScroll:refresh');
        }
    })
    
    // bind
    .one('component:setup', function(event) {
        var $this = $(this);
        var inner = $(this).triggerHandler('quickEdit:getCellInner');
        
        inner.on('click', '> .quick-edit-container > form > .tools .revert', function(event) {
            $this.trigger('quickEdit:revert');
        });
    });
    
    return this;
}