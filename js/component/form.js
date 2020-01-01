/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// form
// script with behaviours for a form component
Component.Form = function() 
{   
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // component
    Component.BlockEvent.call(this,'submit');
    
    
    // handler
    setHdlrs(this,'form:',{
        
        isSubmitted: function() {
            return (getData(this,'form-submitted') === 1)? true:false;
        },
        
        getFields: function() {
            return qsa(this,Dom.selectorInput(false));
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
        
        getSerializeFields: function() {
            return Arr.filter(trigHdlr(this,'form:getFields'),function() {
                return trigHdlr(this,'input:isSerialize');
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
                        return Nod.match(this,"[name='"+name+"']");
                    });
                }
            }
            
            return r;
        },
        
        serialize: function() {
            const target = trigHdlr(this,'form:getSerializeFields');
            return Ele.serialize(target);
        },
        
        hasChanged: function() {
            let r = false;
            const serialize = trigHdlr(this,'form:serialize');
            const original = getData(this,'form-serialize');
            
            if(original != null && serialize !== original)
            r = true;
            
            return r;
        },
        
        focusFirst: function() {
            const target = Arr.find(trigHdlr(this,'form:getTargetVisibleFields'),function() {
                return trigHdlr(this,'input:isEmpty');
            });

            if(target != null)
            Ele.focus(target);
            
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
        if(!Nod.match(this,"[data-skip-form-prepare='1']"))
        trigEvt(this,'form:prepare');
        
        // submit
        prepareSubmit.call(this);
        
        // validation 
        if(!Nod.match(this,"[data-validation='0']"))
        prepareValidate.call(this);
        
        // confirm
        if(Nod.match(this,"[data-confirm]"))
        prepareConfirm.call(this);
        
        // formUnload
        if(Nod.match(this,"[data-unload]"))
        prepareUnload.call(this);
        
        // block
        if(!Nod.match(this,"[data-block='0']"))
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
            Ele.prepend(this,genuine2);
        }
    }
    
    
    // prepareHasChanged
    const prepareHasChanged = function() 
    {
        const serialize = trigHdlr(this,'form:serialize');
        setData(this,'form-serialize',serialize);
    }
    
    
    // prepareSubmit
    // click sur submit, met un attribut data-clicked
    // bind le message de confirmation s'il y a data-confirm
    const prepareSubmit = function() 
    {
        const submits = trigHdlr(this,'form:getSubmits');
        
        ael(submits,'click',function() {
            Ele.removeAttr(submits,'data-submit-click');
            setAttr(this,'data-submit-click',true);
        });
        
        const submitsConfirm =  Arr.filter(submits,function() {
            return Nod.match(this,'[data-confirm]');
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
        Component.ValidatePrevent.call(this,'submit');
        
        setHdlr(this,'validatePrevent:getTargets',function() {
            const targets = trigHdlr(this,'form:getValidateFields');

            Ele.each(targets,function() {
                if(trigHdlr(this,'input:isValidateSetup') === false)
                trigSetup(this);
            });
            
            return targets;
        });
    }
    
    
    // prepareUnload
    // permet d'ajouter un message d'alerte si le formulaire a changé et on tente de changer la page (unload)
    const prepareUnload = function()
    {
        const $this = this;
        
        setHdlr(this,'windowUnload:getText',function() {
            if(!trigHdlr(this,'form:isSubmitted') && trigHdlr(this,'form:hasChanged'))
            return getAttr(this,'data-unload');
        });
        
        ael(this,'submit',function() {
            setData(this,'form-submitted',1);
        });
        
        trigHdlr(window,'windowUnload:addNode',this);
        
        aelOnce(document,'doc:unmountPage',function() {
            trigHdlr(window,'windowUnload:removeNode',$this);
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