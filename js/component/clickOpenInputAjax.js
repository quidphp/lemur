/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// clickOpenInputAjax
// component for a one field form which triggers an ajax request that shows in a clickOpen
const ClickOpenInputAjax = Component.ClickOpenInputAjax = function(option)
{
    // option
    const $option = Object.assign({
        ajaxEvent: 'submit',
        keyEvent: 'keyup',
        timeout: 800
    },option);
    
    
    // components
    Component.ClickOpenAjax.call(this,$option);
    
    
    // event
    ael(this,'ajaxBlock:complete',function() {
        const field = trigHandler(this,'form:getValidateField');
        trigHandler(field,'timeout:clear',$option.keyEvent);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function(event) {
        bindField.call(this);
        bindSubmit.call(this);
    });
    
    
    // bindField
    const bindField = function()
    {
        const $this = this;
        const field = trigHandler(this,'form:getValidateField');
        
        
        // components
        Component.KeyboardEscape.call(field,true,$option.keyEvent);
        Component.Timeout.call(field,$option.keyEvent,$option.timeout);
        
        
        // handler
        setHandler(field,'inputAjax:submit',function() {
            if(trigHandler(this,'validate:isNotEmptyAndValid'))
            trigEvt($this,$option.ajaxEvent);
        });
        
        
        // event
        ael(field,'validate:invalid',function() {
            trigEvt($this,'clickOpen:close');
        });

        ael(field,'click',function(event) {
            trigHandler($this,'clickOpen:closeOthers');
            
            if(!trigHandler($this,'clickOpen:isOpen'))
            trigHandler(this,'inputAjax:submit');
            
            event.stopPropagation();
        });
        
        ael(field,'timeout:keyup',function() {
            trigHandler(this,'validate:process');
            
            if($(this).is(":focus"))
            trigHandler(this,'inputAjax:submit');
        });
        
        ael(field,'keyboardEscape:blocked',function(event) {
            trigEvt($this,'clickOpen:close');
        });
    }
    
    // bindSubmit
    const bindSubmit = function()
    {
        const submit = trigHandler(this,'form:getSubmit');
        
        ael(submit,'click',function(event) {
            event.stopPropagation();
        });
    }
    
    return this;
}