/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// quickEdit
// script for the quickEdit component in the general page of the CMS
Component.quickEdit = function()
{
    // all
    const $that = $(this);
    
    // ajaxBlock
    Component.ajaxBlock.call(this,'click');
    
    // triggerHandler
    $(this).on('quickEdit:isEditing',function() {
        return (triggerFunc(this,'quickEdit:getTdEditing').length)? true:false;
    })
    .on('ajaxBlock:getStatusNode',function() {
        return triggerFunc(this,'quickEdit:getTd');
    })
    .on('quickEdit:getTd',function() {
        return $(this).parents("td").first();
    })
    .on('quickEdit:getTdEditing',function() {
        return triggerFunc(this,'quickEdit:getTd').filter("[data-editing='1']");
    })
    .on('quickEdit:getCellInner',function() {
        return triggerFunc(this,'quickEdit:getTd').find("> .cell-inner");
    })
    .on('quickEdit:getGeneralComponent',function() {
        return triggerFunc(this,'quickEdit:getCellInner').find("> .general-component");
    })
    .on('quickEdit:getEditContainer',function() {
        return triggerFunc(this,'quickEdit:getCellInner').find("> .quick-edit-container");
    })
    
    // trigger
    .on('quickEdit:revert',function() {
        if(triggerFunc(this,'quickEdit:isEditing'))
        {
            const td = triggerFunc(this,'quickEdit:getTd');
            const editContainer = triggerFunc(this,'quickEdit:getEditContainer');
            $(document).trigger('specificForm:unmount',[editContainer]);
            editContainer.html("");
            td.removeAttr('data-editing');
            triggerCustom(this,'dragScroll:refresh');
        }
    })
    .on('ajax:success',function(event,data,textStatus,jqXHR) {
        if(Str.isNotEmpty(data))
        {
            $that.not($(this)).trigger('quickEdit:revert');
            
            const td = triggerFunc(this,'quickEdit:getTd');
            td.attr('data-editing',1);
            const editContainer = triggerFunc(this,'quickEdit:getEditContainer');
            editContainer.html(data);
            $(document).trigger('document:mountCommon',[editContainer]);
            $(document).trigger('specificForm:mount',[editContainer]);
            triggerCustom(this,'dragScroll:refresh');
        }
    })
    
    // bind
    .one('component:setup',function() {
        const $this = $(this);
        const inner = triggerFunc(this,'quickEdit:getCellInner');
        
        inner.on('click', '> .quick-edit-container > form > .tools .revert',function() {
            $this.trigger('quickEdit:revert');
        });
    });
    
    return this;
}