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
    setHdlrs(this,'form:',{
        
        isSubmitted: function() {
            return ($(this).data('form-submitted') === 1)? true:false;
        },
        
        getFields: function() {
            return qsa(this,Selector.input());
        },
        
        getSystemFields: function() {
            return Arr.filter(trigHdlr(this,'form:getFields'),function() {
                return trigHdlr(this,'input:isSystem');
            });
        },
        
        getTargetFields: function() {
            return Arr.filter(trigHdlr(this,'form:getFields'),function() {
                return trigHdlr(this,'input:isTarget');
            });
        },
        
        getTargetVisibleFields: function() {
            return Arr.filter(trigHdlr(this,'form:getFields'),function() {
                return trigHdlr(this,'input:isTargetVisible');
            });
        },
        
        getValidateFields: function() {
            return Arr.filter(trigHdlr(this,'form:getFields'),function() {
                return trigHdlr(this,'input:isValidate');
            });
        },
        
        getFiles: function() {
            return Arr.filter(trigHdlr(this,'form:getFields'),function() {
                return trigHdlr(this,'input:isFile');
            });
        },
        
        getSubmits: function() {
            return Arr.filter(trigHdlr(this,'form:getFields'),function() {
                return trigHdlr(this,'input:isSubmit');
            });
        },
        
        getCsrfField: function() {
            return Arr.find(trigHdlr(this,'form:getFields'),function() {
                return trigHdlr(this,'input:isCsrf');
            });
        },
        
        getGenuineField: function() {
            return Arr.find(trigHdlr(this,'form:getFields'),function() {
                return trigHdlr(this,'input:isGenuine');
            });
        },
        
        getClickedSubmit: function() {
            return Arr.find(trigHdlr(this,'form:getFields'),function() {
                return trigHdlr(this,'input:isClickedSubmit');
            });
        },
        
        getValidateField: function() {
            return Arr.valueFirst(trigHdlr(this,'form:getValidateFields'));
        },
        
        getSubmit: function() {
            return Arr.valueFirst(trigHdlr(this,'form:getSubmits'));
        },
        
        hasFiles: function() {
            return (Arr.isNotEmpty(trigHdlr(this,'form:getFiles')))? true:false;
        },
        
        getClickedSubmits: function() {
            let r = trigHdlr(this,'form:getClickedSubmit');
            
            if(r != null)
            {
                const name = trigHdlr(r,'input:getName');
                
                if(Str.isNotEmpty(name))
                {
                    r = Arr.filter(trigHdlr(this,'form:getSubmits'),function() {
                        return $(this).is("[name='"+name+"']");
                    });
                }
            }
            
            return r;
        },
        
        hasChanged: function() {
            let r = false;
            const target = trigHdlr(this,'form:getTargetFields');
            const serialize = $(target).serialize();
            const original = $(this).data('form-serialize');
            
            if(original && serialize !== original)
            r = true;
            
            return r;
        },
        
        focusFirst: function() {
            const target = Arr.find(trigHdlr(this,'form:getTargetVisibleFields'),function() {
                return trigHdlr(this,'input:isEmpty');
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
        const genuine = trigHdlr(this,'form:getGenuineField');
        if(genuine != null)
        {
            const name = trigHdlr(genuine,'input:getName');
            const newName = name+"2-";
            const newValue = 1;
            const genuine2 = "<input type='hidden' name='"+newName+"' value='"+newValue+"' />";
            $(this).prepend(genuine2);
        }
    }
    
    
    // prepareHasChanged
    const prepareHasChanged = function() 
    {
        const target = trigHdlr(this,'form:getTargetFields');
        const serialize = $(target).serialize();
        $(this).data('form-serialize',serialize);
    }
    
    
    // prepareSubmit
    // click sur submit, met un attribut data-clicked
    // bind le message de confirmation s'il y a data-confirm
    const prepareSubmit = function() 
    {
        const submits = trigHdlr(this,'form:getSubmits');
        
        ael(submits,'click',function() {
            $(submits).removeAttr('data-submit-click');
            $(this).attr('data-submit-click',true);
        });
        
        const submitsConfirm =  Arr.filter(submits,function() {
            return $(this).is('[data-confirm]');
        });
        Component.Confirm.call(submitsConfirm,'click');
    }
    
    
    // prepareConfirm
    const prepareConfirm = function() 
    {
        Component.Confirm.call(this,'submit');
    }
    
    
    // prepareValidate
    const prepareValidate = function() 
    {
        const validateFields = trigHdlr(this,'form:getValidateFields');
        
        Component.ValidatePrevent.call(this,'submit');
        
        setHdlr(this,'validatePrevent:getTargets',function() {
            return validateFields;
        });
    }
    
    
    // prepareUnload
    // permet d'ajouter un message d'alerte si le formulaire a changé et on tente de changer la page (unload)
    const prepareUnload = function()
    {
        const $this = this;
        
        setHdlr(this,'winUnload:getText',function() {
            if(!trigHdlr(this,'form:isSubmitted') && trigHdlr(this,'form:hasChanged'))
            return $(this).attr('data-unload');
        });
        
        ael(this,'submit',function() {
            $(this).data('form-submitted',1);
        });
        
        trigHdlr(window,'winUnload:addNode',this);
        
        aelOnce(document,'doc:unmountPage',function() {
            trigHdlr(window,'winUnload:removeNode',$this);
        });
    }
    
    
    // prepareBlock
    const prepareBlock = function()
    {
        ael(this,'submit',function() {
            trigHdlr(this,'blockEvent:block','submit');
        });
    }
    
    return this;
}