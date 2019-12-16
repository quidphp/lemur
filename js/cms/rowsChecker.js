/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// rowsChecker
// script for the rows checker component in the general page of the CMS
Component.RowsChecker = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlrs(this,'rowsChecker:',{
        
        getToolsContainer: function() {
            return qs(this,".above .tools-container");
        },
        
        getTools: function() {
            return qsa(trigHdlr(this,'rowsChecker:getToolsContainer'),".tool-element");
        },
        
        getToolsButton: function() {
            return Arr.filter(trigHdlr(this,'rowsChecker:getTools'),function() {
                return $(this).is('button');
            });
        },
        
        getMultiModify: function() {
            return Arr.find(trigHdlr(this,'rowsChecker:getToolsButton'),function() {
                return $(this).is('.multi-modify');
            });
        },
        
        getMultiDelete: function() {
            return Arr.find(trigHdlr(this,'rowsChecker:getTools'),function() {
                return $(this).is(".multi-delete-form");
            }); 
        },
        
        getToolsMulti: function() {
            const multiModify = trigHdlr(this,'rowsChecker:getMultiModify');
            const multiDelete = trigHdlr(this,'rowsChecker:getMultiDelete');
            
            return (multiModify != null && multiDelete != null)? [multiModify,multiDelete]:null;
        },
        
        getTable: function() {
            return qs(this,'table');
        },
        
        getToggleAll: function() {
            return qs(trigHdlr(this,'rowsChecker:getTable'),"th.rows .toggle-all");
        },
        
        getRows: function() {
            return qsa(trigHdlr(this,'rowsChecker:getTable'),"tbody tr");
        },
        
        getCheckedRows: function() {
            const r = [];
            const checked = trigHdlr(this,'rowsChecker:getCheckedCheckboxes');
            
            Arr.each(checked,function() {
                const row = trigHdlr(this,'checkbox:getTr');
                r.push(row);
            });
            
            return r;
        },
        
        getCheckboxes: function() {
            return mergedQsa(trigHdlr(this,'rowsChecker:getRows'),"td.rows input[type='checkbox']");
        },
        
        getCheckedCheckboxes: function() {
            return Arr.filter(trigHdlr(this,'rowsChecker:getCheckboxes'),function() {
                return $(this).is(':checked');
            });
        },
        
        getCheckedSet: function(separator) {
            return Dom.valueSeparator(trigHdlr(this,'rowsChecker:getCheckedCheckboxes'),separator,true);
        },
        
        areAllChecked: function() {
            const checkboxes = trigHdlr(this,'rowsChecker:getCheckboxes');
            const checked = trigHdlr(this,'rowsChecker:getCheckedCheckboxes');
            
            return (checkboxes.length === checked.length)? true:false;
        },
        
        areAllUpdateable: function() {
            return Dom.matchAll("[data-updateable='1']",trigHdlr(this,'rowsChecker:getCheckedRows'));
        },
        
        areAllDeleteable: function() {
            return Dom.matchAll("[data-deleteable='1']",trigHdlr(this,'rowsChecker:getCheckedRows'));
        },
        
        refresh: function() {
            const checked = trigHdlr(this,'rowsChecker:getCheckedCheckboxes');
            const toolsContainer = trigHdlr(this,'rowsChecker:getToolsContainer');
            const toggleAll = trigHdlr(this,'rowsChecker:getToggleAll');
            const multiModify = trigHdlr(this,'rowsChecker:getMultiModify');
            const multiDelete = trigHdlr(this,'rowsChecker:getMultiDelete');
            const oneChecked = (checked.length)? true:false;
            const manyChecked = (checked.length > 1)? true:false;
            const allChecked = trigHdlr(this,'rowsChecker:areAllChecked');
            const showMulti = (manyChecked === true && trigHdlr(this,'rowsChecker:areAllUpdateable'))? true:false;
            const showDelete = (oneChecked === true && trigHdlr(this,'rowsChecker:areAllDeleteable'))? true:false;
            
            $(toggleAll).toggleClass('all-checked',allChecked);
            
            trigHdlr(toolsContainer,(oneChecked === true)? 'toolsContainer:show':'toolsContainer:hide');
            trigHdlr(multiModify,(showMulti === true)? 'toolMulti:show':'toolMulti:hide');
            trigHdlr(multiDelete,(showDelete === true)? 'toolMulti:show':'toolMulti:hide');
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindToggleAll.call(this);
        bindCheckboxes.call(this);
        bindToolsContainer.call(this);
        bindToolsButton.call(this);
        bindToolsMulti.call(this);
        bindMultiDelete.call(this);
    });
    
    
    // bindToggleAll
    const bindToggleAll = function() 
    {
        const $this = this;
        const toggleAll = trigHdlr(this,'rowsChecker:getToggleAll');
        
        // handler
        setHdlrs(toggleAll,'toggleAll:',{
            
            toggle: function() {
                trigHdlr(this,(trigHdlr($this,'rowsChecker:areAllChecked'))? 'toggleAll:uncheck':'toggleAll:check');
            },
            
            check: function() {
                const checkboxes = trigHdlr($this,'rowsChecker:getCheckboxes');
                trigHdlrs(checkboxes,'checkbox:check');
                trigHdlr($this,'rowsChecker:refresh');
            },
            
            uncheck: function() {
                const checkboxes = trigHdlr($this,'rowsChecker:getCheckboxes');
                trigHdlrs(checkboxes,'checkbox:uncheck');
                trigHdlr($this,'rowsChecker:refresh');
            }
        });
        
        // event
        ael(toggleAll,'click',function() {
            trigHdlr(this,'toggleAll:toggle');
        });
    }
    
    
    // bindCheckboxes
    const bindCheckboxes = function() 
    {
        const $this = this;
        const checkboxes = trigHdlr(this,'rowsChecker:getCheckboxes');
        
        // handler
        setHdlrs(checkboxes,'checkbox:',{
            
            getTr: function() {
                return $(this).parents("tr").get(0);
            },
            
            check: function(refresh) {
                const tr = trigHdlr(this,'checkbox:getTr');
                $(this).prop('checked',true);
                setAttr(tr,'data-checked',1);
                
                if(refresh === true)
                trigHdlr($this,'rowsChecker:refresh');
            },
            
            uncheck: function(refresh) {
                const tr = trigHdlr(this,'checkbox:getTr');
                $(this).prop('checked',false);
                setAttr(tr,'data-checked',0);
                
                if(refresh === true)
                trigHdlr($this,'rowsChecker:refresh');
            }
        });
        
        // event
        ael(checkboxes,'change',function() {
            trigHdlr(this,($(this).is(":checked"))? 'checkbox:check':'checkbox:uncheck',true);
        });
    }
    
    
    // bindToolsContainer
    const bindToolsContainer = function() 
    {
        const container = trigHdlr(this,'rowsChecker:getToolsContainer');
        
        // handler
        setHdlr(container,'toolsContainer:show',function() {
            setAttr(this,'data-status','visible');
        });
        
        setHdlr(container,'toolsContainer:hide',function() {
            setAttr(this,'data-status','hidden');
        });
    }
    
    
    // bindToolsButton
    const bindToolsButton = function() 
    {
        const $this = this;
        const button = trigHdlr(this,'rowsChecker:getToolsButton');
        
        // handler
        setHdlr(button,'toolButton:redirect',function(clickEvent) {
            const separator = getAttr(this,"data-separator");
            const set = trigHdlr($this,'rowsChecker:getCheckedSet',separator);
            const href = Dom.dataHrefReplaceChar(this,set);
            
            if(Str.isNotEmpty(href))
            trigHdlr(document,'history:href',href,clickEvent);
        });
        
        // event
        ael(button,'click',function(event) {
            trigHdlr(this,'toolButton:redirect',event);
        });
    }
    
    
    // bindToolsMulti
    const bindToolsMulti = function() 
    {
        const tools = trigHdlr(this,'rowsChecker:getToolsMulti');
        
        // handler
        setHdlr(tools,'toolMulti:show',function() {
            setAttr(this,'data-visible',1);
        });
        
        setHdlr(tools,'toolMulti:hide',function() {
            setAttr(this,'data-visible',0);
        });
    }
    

    // bindMultiDelete
    const bindMultiDelete = function() 
    {
        const $this = this;
        const multiDelete = trigHdlr(this,'rowsChecker:getMultiDelete');
        
        // handler
        setHdlr(multiDelete,'multiDelete:getPrimaries',function() {
            return qsa(this,"input[name='primaries']");
        });
        
        // event 
        ael(multiDelete,'confirm:yes',function(event,submit) {
            const input = trigHdlr(this,'multiDelete:getPrimaries');
            const separator = getAttr(this,'data-separator');
            const set = trigHdlr($this,'rowsChecker:getCheckedSet',separator);
            
            if(Str.isNotEmpty(set))
            $(input).val(set);
            
            else
            submit.preventDefault();
        });
    }
    
    return this;
}