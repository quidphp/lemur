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
            return trigHdlr(this,'quickEdit:getTdEditing') != null;
        },
        
        getTdOthers: function() {
            const nodes = Ele.toArray($nodes);
            return Arr.valueStrip(this,nodes);
        },
        
        getTd: function() {
            return Ele.closest(this,"td");
        },
        
        getTdEditing: function() {
            const td = trigHdlr(this,'quickEdit:getTd');
            return (Ele.match(td,"[data-editing='1']"))? td:null;
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
            return Ele.closest(this,".scroller");
        },
        
        revert: function() {
            if(trigHdlr(this,'quickEdit:isEditing'))
            {
                const td = trigHdlr(this,'quickEdit:getTd');
                const node = trigHdlr(this,'ajaxBlock:getContentNode');
                const scroller = trigHdlr(this,'quickEdit:getScroller');
                
                trigHdlr(this,'ajaxBlock:unsetContent');
                toggleAttr(td,'data-editing',false);
                
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

        trigEvt(document,'specificForm:mountAll',node);
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
            toggleAttr(td,'data-editing',true);
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