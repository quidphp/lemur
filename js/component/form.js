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
        return $(this).find(Selector.input());
    });
    
    setFunc(this,'form:getSystemFields',function() {
        return triggerFunc(this,'form:getFields').filter(function() {
            return triggerFunc(this,'input:isSystem');
        });
    });
    
    setFunc(this,'form:getTargetFields',function() {
        return triggerFunc(this,'form:getFields').filter(function() {
            return triggerFunc(this,'input:isTarget');
        });
    });
    
    setFunc(this,'form:getTargetVisibleFields',function() {
        return triggerFunc(this,'form:getFields').filter(function() {
            return triggerFunc(this,'input:isTargetVisible');
        });
    });
    
    setFunc(this,'form:getValidateFields',function() {
        return triggerFunc(this,'form:getFields').filter(function() {
            return triggerFunc(this,'input:isValidate');
        });
    });
    
    setFunc(this,'form:getFiles',function() {
        return triggerFunc(this,'form:getFields').filter(function() {
            return triggerFunc(this,'input:isFile');
        });
    });
    
    setFunc(this,'form:getCsrfField',function() {
        return triggerFunc(this,'form:getFields').filter(function() {
            return triggerFunc(this,'input:isCsrf');
        }).first();
    });
    
    setFunc(this,'form:getGenuineField',function() {
        return triggerFunc(this,'form:getFields').filter(function() {
            return triggerFunc(this,'input:isGenuine');
        }).first();
    });
    
    setFunc(this,'form:getSubmits',function() {
        return triggerFunc(this,'form:getFields').filter(function() {
            return triggerFunc(this,'input:isSubmit');
        });
    });
    
    setFunc(this,'form:getClickedSubmit',function() {
        return triggerFunc(this,'form:getFields').filter(function() {
            return triggerFunc(this,'input:isClickedSubmit');
        }).first();
    });
    
    setFunc(this,'form:getValidateField',function() {
        return triggerFunc(this,'form:getValidateFields').first();
    });
    
    setFunc(this,'form:hasFiles',function() {
        return (triggerFunc(this,'form:getFiles').length)? true:false;
    });
    
    setFunc(this,'form:getSubmit',function() {
        return triggerFunc(this,'form:getSubmits').first();
    });
    
    setFunc(this,'form:getClickedSubmits',function() {
        let r = triggerFunc(this,'form:getClickedSubmit');
        
        if(r.length)
        {
            const name = triggerFunc(r,'input:getName');
            if(Str.isNotEmpty(name))
            r = triggerFunc(this,'form:getSubmits').filter("[name='"+name+"']");
        }
        
        return r;
    });
    
    setFunc(this,'form:hasChanged',function() {
        let r = false;
        const target = triggerFunc(this,'form:getTargetFields');
        const serialize = target.serialize();
        const original = $(this).data('form-serialize');
        
        if(original && serialize !== original)
        r = true;
        
        return r;
    });
    
    setFunc(this,'form:focusFirst',function() {
        triggerFunc(this,'form:getTargetVisibleFields').filter(function() {
            return triggerFunc(this,'input:isEmpty');
        }).first().focus();
        
        return this;
    });
    
    
    // prepare
    aelOnce(this,'form:prepare',function() {
        prepareGenuine.call(this);
        prepareHasChanged.call(this);
    });
    
    
    // setup
    aelOnce(this,'form:setup',function() {
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
        if(genuine.length === 1)
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
        const serialize = target.serialize();
        $(this).data('form-serialize',serialize);
    }
    
    
    // prepareSubmit
    // click sur submit, met un attribut data-clicked
    const prepareSubmit = function() 
    {
        const submits = triggerFunc(this,'form:getSubmits');
        
        ael(submits,'click',function() {
            submits.removeAttr('data-submit-click');
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
        triggerCustom(validateFields,'input:validate:setup');
        
        Component.ValidatePrevent.call(this,'submit');
        setFunc(this,'validatePrevent:getTargets',function() {
            return validateFields;
        });
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