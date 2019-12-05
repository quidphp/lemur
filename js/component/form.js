/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// form
// script with behaviours for a form component
const Form = function() 
{    
    // nodes
    const $nodes = this;
    
    
    // block
    Component.BlockEvent.call(this,'submit');
    
    
    // func
    setFunc(this,'form:isSubmitted',function() {
        return ($(this).data('form-submitted') === 1)? true:false;
    });
    
    setFunc(this,'form:getFields',function() {
        return qsa(this,Selector.input());
    });
    
    setFunc(this,'form:getSystemFields',function() {
        const fields = triggerFunc(this,'form:getFields');
        
        return fields.filter(function(value) {
            return triggerFunc(value,'input:isSystem');
        });
    });
    
    setFunc(this,'form:getTargetFields',function() {
        const fields = triggerFunc(this,'form:getFields');
        
        return fields.filter(function(value) {
            return triggerFunc(value,'input:isTarget');
        });
    });
    
    setFunc(this,'form:getTargetVisibleFields',function() {
        const fields = triggerFunc(this,'form:getFields');
        
        return fields.filter(function(value) {
            return triggerFunc(value,'input:isTargetVisible');
        });
    });
    
    setFunc(this,'form:getValidateFields',function() {
        const fields = triggerFunc(this,'form:getFields');
        
        return fields.filter(function(value) {
            return triggerFunc(value,'input:isValidate');
        });
    });
    
    setFunc(this,'form:getFiles',function() {
        const fields = triggerFunc(this,'form:getFields');
        
        return fields.filter(function(value) {
            return triggerFunc(value,'input:isFile');
        });
    });
    
    setFunc(this,'form:getCsrfField',function() {
        const fields = triggerFunc(this,'form:getFields');
        
        return fields.find(function(value) {
            return triggerFunc(value,'input:isCsrf');
        });
    });
    
    setFunc(this,'form:getGenuineField',function() {
        const fields = triggerFunc(this,'form:getFields');
        
        return fields.find(function(value) {
            return triggerFunc(value,'input:isGenuine');
        });
    });
    
    setFunc(this,'form:getSubmits',function() {
        const fields = triggerFunc(this,'form:getFields');
        
        return fields.find(function(value) {
            return triggerFunc(value,'input:isSubmit');
        });
    });
    
    setFunc(this,'form:getClickedSubmit',function() {
        const fields = triggerFunc(this,'form:getFields');
        
        return fields.find(function(value) {
            return triggerFunc(value,'input:isClickedSubmit');
        });
    });
    
    setFunc(this,'form:getValidateField',function() {
        return Arr.valueFirst(triggerFunc(this,'form:getValidateFields'));
    });
    
    setFunc(this,'form:getSubmit',function() {
        return Arr.valueFirst(triggerFunc(this,'form:getSubmits'));
    });
    
    setFunc(this,'form:hasFiles',function() {
        return (triggerFunc(this,'form:getFiles').length)? true:false;
    });
    
    setFunc(this,'form:getClickedSubmits',function() {
        let r = triggerFunc(this,'form:getClickedSubmit');
        
        if(r != null)
        {
            const name = triggerFunc(r,'input:getName');
            
            if(Str.isNotEmpty(name))
            {
                const submits = triggerFunc(this,'form:getSubmits');
                r = submits.filter(function(value) {
                    return $(value).is("[name='"+name+"']");
                });
            }
        }
        
        return r;
    });
    
    setFunc(this,'form:hasChanged',function() {
        let r = false;
        const target = triggerFunc(this,'form:getTargetFields');
        const serialize = $(target).serialize();
        const original = $(this).data('form-serialize');
        
        if(original && serialize !== original)
        r = true;
        
        return r;
    });
    
    setFunc(this,'form:focusFirst',function() {
        const target = triggerFunc(this,'form:getTargetVisibleFields').find(function(value) {
            return triggerFunc(value,'input:isEmpty');
        });
        
        if(target != null)
        $(target).focus();
        
        return this;
    });
    
    
    // prepare
    aelOnce(this,'form:prepare',function() {
        prepareGenuine.call(this);
        prepareHasChanged.call(this);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        // input
        prepareInput.call(this);
        
        // genuine + hasChanged
        if(!$(this).is("[data-skip-form-prepare='1']"))
        triggerCustom(this,'form:prepare');
        
        // submit
        prepareSubmit.call(this);
        
        // validation 
        if(!$(this).is("[data-validation='0']"))
        prepareValidate.call(this);
        
        // confirm
        if($(this).is("[data-confirm]"))
        prepareConfirm.call(this);
        
        // formUnload
        if($(this).is("[data-unload]"))
        prepareUnload.call(this);
        
        // block
        if(!$(this).is("[data-block='0']"))
        prepareBlock.call(this);
    });
    
    
    // prepareInput
    const prepareInput = function()
    {
        const fields = triggerFunc(this,'form:getFields');
        triggerCustom(fields,'input:form:setup');
    }
    
    
    // prepareGenuine
    const prepareGenuine = function() 
    {
        const genuine = triggerFunc(this,'form:getGenuineField');
        if(genuine != null)
        {
            const name = triggerFunc(genuine,'input:getName');
            const newName = name+"2-";
            const newValue = 1;
            const genuine2 = "<input type='hidden' name='"+newName+"' value='"+newValue+"' />";
            $(this).prepend(genuine2);
        }
    }
    
    
    // prepareHasChanged
    const prepareHasChanged = function() 
    {
        const target = triggerFunc(this,'form:getTargetFields');
        const serialize = $(target).serialize();
        $(this).data('form-serialize',serialize);
    }
    
    
    // prepareSubmit
    // click sur submit, met un attribut data-clicked
    const prepareSubmit = function() 
    {
        const submits = triggerFunc(this,'form:getSubmits');
        
        ael(submits,'click',function() {
            $(submits).removeAttr('data-submit-click');
            $(this).attr('data-submit-click',true);
        });
    }
    
    
    // prepareConfirm
    const prepareConfirm = function() 
    {
        Component.Confirm.call(this,'submit');
    }
    
    
    // prepareValidate
    const prepareValidate = function() 
    {
        const validateFields = triggerFunc(this,'form:getValidateFields');
        
        Component.ValidatePrevent.call(this,'submit');
        
        setFunc(this,'validatePrevent:getTargets',function() {
            return validateFields;
        });
        
        triggerSetup(this);
        
        triggerCustom(validateFields,'input:validate:setup');
    }
    
    
    // prepareUnload
    // permet d'ajouter un message d'alerte si le formulaire a changé et on tente de changer la page (unload)
    const prepareUnload = function()
    {
        const $this = this;
        
        setFunc(this,'win:unloadText',function() {
            if(!triggerFunc(this,'form:isSubmitted') && triggerFunc(this,'form:hasChanged'))
            return $(this).attr('data-unload');
        });
        
        ael(this,'submit',function() {
            $(this).data('form-submitted',1);
        });
        
        triggerFunc(window,'win:addUnloadNode',this);
        
        aelOnce(document,'doc:unmount',function() {
            triggerFunc(window,'win:removeUnloadNode',$this);
        });
    }
    
    
    // prepareBlock
    const prepareBlock = function()
    {
        ael(this,'submit',function() {
            triggerFunc(this,'blockEvent:block','submit');
        });
    }
    
    return this;
}

// export
Component.Form = Form;