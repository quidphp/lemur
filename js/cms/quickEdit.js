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
    setHandler(this,'quickEdit:isEditing',function() {
        return (trigHandler(this,'quickEdit:getTdEditing') != null)? true:false;
    });
    
    setHandler(this,'quickEdit:getTdOthers',function() {
        return $($nodes).not(this).get();
    });
    
    setHandler(this,'quickEdit:getTd',function() {
        return $(this).parents("td").get(0);
    });
    
    setHandler(this,'quickEdit:getTdEditing',function() {
        const td = trigHandler(this,'quickEdit:getTd');
        return ($(td).is("[data-editing='1']"))? td:null;
    });
    
    setHandler(this,'quickEdit:getCellInner',function() {
        return qs(trigHandler(this,'quickEdit:getTd'),"> .cell-inner");
    });
    
    setHandler(this,'quickEdit:getGeneralComponent',function() {
        return qs(trigHandler(this,'quickEdit:getCellInner'),"> .general-component");
    });
    
    setHandler(this,'quickEdit:getEditContainer',function() {
        return qs(trigHandler(this,'quickEdit:getCellInner'),"> .quick-edit-container");
    });
    
    setHandler(this,'quickEdit:getScroller',function() {
        return $(this).parents(".scroller").get(0);
    });
    
    setHandler(this,'quickEdit:revert',function() {
        if(trigHandler(this,'quickEdit:isEditing'))
        {
            const td = trigHandler(this,'quickEdit:getTd');
            const node = trigHandler(this,'ajaxBlock:getContentNode');
            const scroller = trigHandler(this,'quickEdit:getScroller');
            
            trigHandler(this,'ajaxBlock:unsetContent');
            $(td).removeAttr('data-editing');
        }
    });
    
    setHandler(this,'ajaxBlock:getStatusNode',function() {
        return trigHandler(this,'quickEdit:getTd');
    });
    
    setHandler(this,'ajaxBlock:getContentNode',function() {
        return trigHandler(this,'quickEdit:getEditContainer');
    });
    
    
    // event
    ael(this,'ajaxBlock:mountContent',function() {
        const node = trigHandler(this,'ajaxBlock:getContentNode');
        const scroller = trigHandler(this,'quickEdit:getScroller');

        trigEvt(document,'doc:specificForm:mount',node);
        trigEvt(scroller,'dragScroll:refresh');
    });
    
    ael(this,'ajaxBlock:unmountContent',function() {
        const node = trigHandler(this,'ajaxBlock:getContentNode');
        const scroller = trigHandler(this,'quickEdit:getScroller');
        
        trigEvt(document,'specificForm:unmount',node);
        trigEvt(scroller,'dragScroll:refresh');
    });
    
    ael(this,'ajaxBlock:beforeMount',function(event,data,isError) {
        if(Str.isNotEmpty(data))
        {
            const others = trigHandler(this,'quickEdit:getTdOthers');
            trigHandlers(others,'quickEdit:revert');
            
            const td = trigHandler(this,'quickEdit:getTd');
            $(td).attr('data-editing',1);
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        const $this = this;
        const node = trigHandler(this,'ajaxBlock:getContentNode');
        
        aelDelegate(node,'click','> form > .tools .revert',function() {
            trigHandler($this,'quickEdit:revert');
        });
    });
    
    return this;
}