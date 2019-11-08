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
            var td = $(this).triggerHandler('quickEdit:getTd');
            td.attr('data-editing',1);
            var editContainer = $(this).triggerHandler('quickEdit:getEditContainer');
            editContainer.html(data);
            $(document).trigger('document:commonBindings',[editContainer]).trigger('specific:formPrepare',[editContainer]);
            
            var form = editContainer.find("form");
            form.formUnload();
            
            $all.not($(this)).trigger('quickEdit:revert');
        }
    }
    
    $(this).ajaxBlock('click')
    .on('ajaxBlock:getStatusNode', function(event) {
        return $(this).triggerHandler('quickEdit:getTd');
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        setForm.call(this,data);
    })
    .on('quickEdit:getTd', function(event) {
        return $(this).parents("td").first();
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
    .on('quickEdit:revert', function(event) {
        var td = $(this).triggerHandler('quickEdit:getTd');
        var editContainer = $(this).triggerHandler('quickEdit:getEditContainer');
        editContainer.html("");
        td.removeAttr('data-editing');
    })
    .on('quickEdit:bind', function(event) {
        var $this = $(this);
        
        $(this).triggerHandler('quickEdit:getCellInner').on('click', '> .quick-edit-container > form > .tools .revert', function(event) {
            $this.trigger('quickEdit:revert');
        });
    })
    .trigger('quickEdit:bind');
    
    return this;
}