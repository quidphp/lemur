/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenInputAjax
// component for a one field form which triggers an ajax request that shows in a clickOpen
Component.ClickOpenInputAjax = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        ajaxEvent: 'submit',
        inputSearch: {
            keyEvent: 'keydown',
            timeout: 800
        }
    },option);
    
    
    // components
    Component.ClickOpenAjax.call(this,$option);
    
    
    // event
    ael(this,'ajaxBlock:complete',function() {
        const field = trigHdlr(this,'form:getValidateField');
        trigHdlr(field,'inputSearch:success');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function(event) {
        bindField.call(this);
    });
    
    
    // bindField
    const bindField = function()
    {
        const $this = this;
        const field = trigHdlr(this,'form:getValidateField');
        
        // components
        Component.KeyboardEscape.call(field,true,$option.inputSearch.keyEvent);
        Component.InputSearch.call(field,$option.inputSearch);
        
        
        // handler
        setHdlr(field,'inputSearch:getButton',function() {
            return trigHdlr($this,'form:getSubmit');
        });
        
        // event
        ael(field,'keyboardEscape:blocked',function(event,keyEvent) {
            trigHdlr(this,'inputSearch:clearTimeout');
            trigEvt($this,'clickOpen:close');
        });
        
        ael(field,'click',function(event) {
            trigHdlr($this,'clickOpen:closeOthers');
            
            if(!trigHdlr($this,'clickOpen:isOpen') && !trigHdlr(this,'input:isEmpty'))
            trigHdlr(this,'inputSearch:process');
        });
        
        ael(field,'validate:invalid',function() {
            trigEvt($this,'clickOpen:close');
        });
        
        ael(field,'inputSearch:change',function() {
            trigEvt($this,$option.ajaxEvent);
        });
        
        
        trigSetup(field);
    }
    
    return this;
}