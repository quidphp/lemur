/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// form
// script with behaviours for a form component
const Form = Component.Form = function() 
{    
    // component
    Component.BlockEvent.call(this,'submit');
    
    
    // handler
    setHandlers(this,'form:',{
        
        isSubmitted: function() {
            return ($(this).data('form-submitted') === 1)? true:false;
        },
        
        getFields: function() {
            return qsa(this,Selector.input());
        },
        
        getSystemFields: function() {
            return Arr.filter(trigHandler(this,'form:getFields'),function() {
                return trigHandler(this,'input:isSystem');
            });
        },
        
        getTargetFields: function() {
            return Arr.filter(trigHandler(this,'form:getFields'),function() {
                return trigHandler(this,'input:isTarget');
            });
        },
        
        getTargetVisibleFields: function() {
            return Arr.filter(trigHandler(this,'form:getFields'),function() {
                return trigHandler(this,'input:isTargetVisible');
            });
        },
        
        getValidateFields: function() {
            return Arr.filter(trigHandler(this,'form:getFields'),function() {
                return trigHandler(this,'input:isValidate');
            });
        },
        
        getFiles: function() {
            return Arr.filter(trigHandler(this,'form:getFields'),function() {
                return trigHandler(this,'input:isFile');
            });
        },
        
        getSubmits: function() {
            return Arr.filter(trigHandler(this,'form:getFields'),function() {
                return trigHandler(this,'input:isSubmit');
            });
        },
        
        getCsrfField: function() {
            return Arr.find(trigHandler(this,'form:getFields'),function() {
                return trigHandler(this,'input:isCsrf');
            });
        },
        
        getGenuineField: function() {
            return Arr.find(trigHandler(this,'form:getFields'),function() {
                return trigHandler(this,'input:isGenuine');
            });
        },
        
        getClickedSubmit: function() {
            return Arr.find(trigHandler(this,'form:getFields'),function() {
                return trigHandler(this,'input:isClickedSubmit');
            });
        },
        
        getValidateField: function() {
            return Arr.valueFirst(trigHandler(this,'form:getValidateFields'));
        },
        
        getSubmit: function() {
            return Arr.valueFirst(trigHandler(this,'form:getSubmits'));
        },
        
        hasFiles: function() {
            return (Arr.isNotEmpty(trigHandler(this,'form:getFiles')))? true:false;
        },
        
        getClickedSubmits: function() {
            let r = trigHandler(this,'form:getClickedSubmit');
            
            if(r != null)
            {
                const name = trigHandler(r,'input:getName');
                
                if(Str.isNotEmpty(name))
                {
                    r = Arr.filter(trigHandler(this,'form:getSubmits'),function() {
                        return $(this).is("[name='"+name+"']");
                    });
                }
            }
            
            return r;
        },
        
        hasChanged: function() {
            let r = false;
            const target = trigHandler(this,'form:getTargetFields');
            const serialize = $(target).serialize();
            const original = $(this).data('form-serialize');
            
            if(original && serialize !== original)
            r = true;
            
            return r;
        },
        
        focusFirst: function() {
            const target = Arr.find(trigHandler(this,'form:getTargetVisibleFields'),function() {
                return trigHandler(this,'input:isEmpty');
            });

            if(target != null)
            $(target).focus();
            
            return this;
        }
    });
    
    
    // prepare
    aelOnce(this,'form:prepare',function() {
        prepareGenuine.call(this);
        prepareHasChanged.call(this);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        // genuine + hasChanged
        if(!$(this).is("[data-skip-form-prepare='1']"))
        trigEvt(this,'form:prepare');
        
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
        
        // setup
        trigSetup(this);
    });
    
    
    // prepareGenuine
    const prepareGenuine = function() 
    {
        const genuine = trigHandler(this,'form:getGenuineField');
        if(genuine != null)
        {
            const name = trigHandler(genuine,'input:getName');
            const newName = name+"2-";
            const newValue = 1;
            const genuine2 = "<input type='hidden' name='"+newName+"' value='"+newValue+"' />";
            $(this).prepend(genuine2);
        }
    }
    
    
    // prepareHasChanged
    const prepareHasChanged = function() 
    {
        const target = trigHandler(this,'form:getTargetFields');
        const serialize = $(target).serialize();
        $(this).data('form-serialize',serialize);
    }
    
    
    // prepareSubmit
    // click sur submit, met un attribut data-clicked
    const prepareSubmit = function() 
    {
        const submits = trigHandler(this,'form:getSubmits');
        
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
        const validateFields = trigHandler(this,'form:getValidateFields');
        
        Component.ValidatePrevent.call(this,'submit');
        
        setHandler(this,'validatePrevent:getTargets',function() {
            return validateFields;
        });
    }
    
    
    // prepareUnload
    // permet d'ajouter un message d'alerte si le formulaire a changé et on tente de changer la page (unload)
    const prepareUnload = function()
    {
        const $this = this;
        
        setHandler(this,'win:unloadText',function() {
            if(!trigHandler(this,'form:isSubmitted') && trigHandler(this,'form:hasChanged'))
            return $(this).attr('data-unload');
        });
        
        ael(this,'submit',function() {
            $(this).data('form-submitted',1);
        });
        
        trigHandler(window,'win:addUnloadNode',this);
        
        aelOnce(document,'doc:unmount',function() {
            trigHandler(window,'win:removeUnloadNode',$this);
        });
    }
    
    
    // prepareBlock
    const prepareBlock = function()
    {
        ael(this,'submit',function() {
            trigHandler(this,'blockEvent:block','submit');
        });
    }
    
    return this;
}