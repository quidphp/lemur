/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// quickEdit
// script for the quickEdit component in the general page of the CMS
const QuickEdit = Component.QuickEdit = function()
{
    // nodes
    const $nodes = this;
    

    // components
    Component.AjaxBlock.call(this);
    
    
    // handler
    setHdlr(this,'quickEdit:isEditing',function() {
        return (trigHdlr(this,'quickEdit:getTdEditing') != null)? true:false;
    });
    
    setHdlr(this,'quickEdit:getTdOthers',function() {
        return $($nodes).not(this).get();
    });
    
    setHdlr(this,'quickEdit:getTd',function() {
        return $(this).parents("td").get(0);
    });
    
    setHdlr(this,'quickEdit:getTdEditing',function() {
        const td = trigHdlr(this,'quickEdit:getTd');
        return ($(td).is("[data-editing='1']"))? td:null;
    });
    
    setHdlr(this,'quickEdit:getCellInner',function() {
        return qs(trigHdlr(this,'quickEdit:getTd'),"> .cell-inner");
    });
    
    setHdlr(this,'quickEdit:getGeneralComponent',function() {
        return qs(trigHdlr(this,'quickEdit:getCellInner'),"> .general-component");
    });
    
    setHdlr(this,'quickEdit:getEditContainer',function() {
        return qs(trigHdlr(this,'quickEdit:getCellInner'),"> .quick-edit-container");
    });
    
    setHdlr(this,'quickEdit:getScroller',function() {
        return $(this).parents(".scroller").get(0);
    });
    
    setHdlr(this,'quickEdit:revert',function() {
        if(trigHdlr(this,'quickEdit:isEditing'))
        {
            const td = trigHdlr(this,'quickEdit:getTd');
            const node = trigHdlr(this,'ajaxBlock:getContentNode');
            const scroller = trigHdlr(this,'quickEdit:getScroller');
            
            trigHdlr(this,'ajaxBlock:unsetContent');
            $(td).attr('data-editing',0);
            
            trigHdlr(scroller,'scrollDrag:refresh');
        }
    });
    
    setHdlr(this,'ajaxBlock:getStatusNode',function() {
        return trigHdlr(this,'quickEdit:getTd');
    });
    
    setHdlr(this,'ajaxBlock:getContentNode',function() {
        return trigHdlr(this,'quickEdit:getEditContainer');
    });
    
    
    // event
    ael(this,'ajaxBlock:mountContent',function() {
        const node = trigHdlr(this,'ajaxBlock:getContentNode');
        const scroller = trigHdlr(this,'quickEdit:getScroller');

        trigEvt(document,'doc:specificForm:mount',node);
        trigHdlr(scroller,'scrollDrag:refresh');
    });
    
    ael(this,'ajaxBlock:unmountContent',function() {
        const node = trigHdlr(this,'ajaxBlock:getContentNode');
        trigEvt(document,'specificForm:unmount',node);
    });
    
    ael(this,'ajaxBlock:beforeMount',function(event,data,isError) {
        if(Str.isNotEmpty(data))
        {
            const others = trigHdlr(this,'quickEdit:getTdOthers');
            trigHdlrs(others,'quickEdit:revert');
            
            const td = trigHdlr(this,'quickEdit:getTd');
            $(td).attr('data-editing',1);
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const $this = this;
        const node = trigHdlr(this,'ajaxBlock:getContentNode');
        
        aelDelegate(node,'click','> form > .tools .revert',function() {
            trigHdlr($this,'quickEdit:revert');
        });
    });
    
    return this;
}