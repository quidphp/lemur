/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// quickEdit
// script for the quickEdit component in the general page of the CMS
Component.QuickEdit = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // nodes
    const $nodes = this;
    

    // components
    Component.AjaxBlock.call(this);
    
    
    // handler
    setHdlrs(this,'quickEdit:',{
        
        isEditing: function() {
            return (trigHdlr(this,'quickEdit:getTdEditing') != null)? true:false;
        },
        
        getTdOthers: function() {
            return $($nodes).not(this).get();
        },
        
        getTd: function() {
            return $(this).parents("td").get(0);
        },
        
        getTdEditing: function() {
            const td = trigHdlr(this,'quickEdit:getTd');
            return ($(td).is("[data-editing='1']"))? td:null;
        },
        
        getCellInner: function() {
            return qs(trigHdlr(this,'quickEdit:getTd'),"> .cell-inner");
        },
        
        getGeneralComponent: function() {
            return qs(trigHdlr(this,'quickEdit:getCellInner'),"> .general-component");
        },
        
        getEditContainer: function() {
            return qs(trigHdlr(this,'quickEdit:getCellInner'),"> .quick-edit-container");
        },
        
        getScroller: function() {
            return $(this).parents(".scroller").get(0);
        },
        
        revert: function() {
            if(trigHdlr(this,'quickEdit:isEditing'))
            {
                const td = trigHdlr(this,'quickEdit:getTd');
                const node = trigHdlr(this,'ajaxBlock:getContentNode');
                const scroller = trigHdlr(this,'quickEdit:getScroller');
                
                trigHdlr(this,'ajaxBlock:unsetContent');
                setAttr(td,'data-editing',0);
                
                trigHdlr(scroller,'scrollDrag:refresh');
            }
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

        trigEvt(document,'specificForm:mount',node);
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
            setAttr(td,'data-editing',1);
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