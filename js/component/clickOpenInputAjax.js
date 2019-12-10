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
        const field = triggerFunc(this,'form:getValidateField');
        triggerFunc(field,'timeout:clear',$option.keyEvent);
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
        const field = triggerFunc(this,'form:getValidateField');
        
        
        // components
        Component.KeyboardEscape.call(field,true,$option.keyEvent);
        Component.Timeout.call(field,$option.keyEvent,$option.timeout);
        
        
        // func
        setFunc(field,'inputAjax:submit',function() {
            if(triggerFunc(this,'validate:isNotEmptyAndValid'))
            triggerEvent($this,$option.ajaxEvent);
        });
        
        
        // event
        ael(field,'validate:invalid',function() {
            triggerEvent($this,'clickOpen:close');
        });

        ael(field,'click',function(event) {
            triggerFunc($this,'clickOpen:closeOthers');
            
            if(!triggerFunc($this,'clickOpen:isOpen'))
            triggerFunc(this,'inputAjax:submit');
            
            event.stopPropagation();
        });
        
        ael(field,'timeout:keyup',function() {
            triggerFunc(this,'validate:process');
            
            if($(this).is(":focus"))
            triggerFunc(this,'inputAjax:submit');
        });
        
        ael(field,'keyboardEscape:blocked',function(event) {
            triggerEvent($this,'clickOpen:close');
        });
    }
    
    // bindSubmit
    const bindSubmit = function()
    {
        const submit = triggerFunc(this,'form:getSubmit');
        
        ael(submit,'click',function(event) {
            event.stopPropagation();
        });
    }
    
    return this;
}