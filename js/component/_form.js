/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// form
// script with behaviours for a form component
Component.form = function() {
    
    // alias
    const setFunc = Evt.setFunc;
    const triggerFunc = Evt.triggerFunc;
    const ael = Evt.addEventListener;
    const triggerCustom = Evt.triggerCustom;
    
    // block
    Component.block.call(this,'submit');
    
    // triggerHandler
    $(this).on('form:getFields',function(event) {
        return $(this).find("input,select,textarea,button[type='submit']");
    })
    .on('form:getSystemFields',function(event) {
        return triggerFunc(this,'form:getFields').filter("[name^='-']");
    })
    .on('form:getTargetFields',function(event) {
        return triggerFunc(this,'form:getFields').not(':disabled').filter("[name]").not("[name^='-']");
    })
    .on('form:getTargetVisibleFields',function(event) {
        return triggerFunc(this,'form:getTargetFields').filter(":visible");
    })
    .on('form:getValidateFields',function(event) {
        return triggerFunc(this,'form:getTargetFields').filter("[data-required],[data-pattern]");
    })
    .on('form:getValidateField',function(event) {
        return triggerFunc(this,'form:getValidateFields').first();
    })
    .on('form:hasFiles',function(event) {
        return (triggerFunc(this,'form:getTargetFields').filter("input[type='file']").length)? true:false;
    })
    .on('form:getSubmits',function(event) {
        return triggerFunc(this,'form:getFields').filter("[type='submit'],[type='image']");
    })
    .on('form:getSubmit',function(event) {
        return triggerFunc(this,'form:getSubmits').first();
    })
    .on('form:getClickedSubmit',function(event) {
        return triggerFunc(this,'form:getSubmits').filter("[data-submit-click]").first();
    })
    .on('form:getClickedSubmits',function(event) {
        let r = triggerFunc(this,'form:getClickedSubmit');
        
        if(r.length)
        {
            const name = r.prop('name');
            if(Str.isNotEmpty(name))
            r = triggerFunc(this,'form:getSubmits').filter("[name='"+name+"']");
        }
        
        return r;
    })
    .on('form:getCsrfField',function(event) {
        return triggerFunc(this,'form:getSystemFields').filter("[data-csrf='1']").first();
    })
    .on('form:getGenuineField',function(event) {
        return triggerFunc(this,'form:getSystemFields').filter("[data-genuine='1']").first();
    })
    .on('form:hasChanged',function(event) {
        let r = false;
        const target = triggerFunc(this,'form:getTargetFields');
        const serialize = target.serialize();
        const original = $(this).data('form:serialize');
        
        if(original && serialize !== original)
        r = true;
        
        return r;
    })
    .on('form:focusFirst',function(event) {
        triggerFunc(this,'form:getTargetVisibleFields').filter(function() {
            return triggerFunc(this,'input:isEmpty');
        }).first().focus();
        
        return this;
    })
    
    // prepare
    .on('form:prepare',function(event) {
        prepareGenuine.call(this);
        prepareHasChanged.call(this);
    })
    
    // setup
    .one('form:setup',function(event) {
        if(!$(this).is("[data-skip-form-prepare='1']"))
        triggerCustom(this,'form:prepare');
        
        // click sur submit, met un attribut data-clicked
        const submits = triggerFunc(this,'form:getSubmits');
        submits.on('click',function(event) {
            submits.removeAttr('data-submit-click');
            $(this).attr('data-submit-click',true);
        });
        
        // validation
        if(!$(this).is("[data-validation='0']"))
        Component.validatePrevent.call(this,'submit');
        
        // formUnload
        if($(this).is("[data-unload]"))
        prepareUnload.call(this);
        
        // block
        if(!$(this).is("[data-block='0']"))
        {
            $(this).on('submit',function(event) {
                triggerCustom(this,'block');
            });
        }
    })
    
    // prepareGenuine
    const prepareGenuine = function() {
        const genuine = triggerFunc(this,'form:getGenuineField');
        if(genuine.length === 1)
        {
            const name = genuine.prop('name');
            const newName = name+"2-";
            const newValue = 1;
            const genuine2 = "<input type='hidden' name='"+newName+"' value='"+newValue+"' />";
            $(this).prepend(genuine2);
        }
    };
    
    // prepareHasChanged
    const prepareHasChanged = function() {
        const target = triggerFunc(this,'form:getTargetFields');
        const serialize = target.serialize();
        $(this).data('form:serialize',serialize);
    };
    
    // prepareUnload
    // permet d'ajouter un message d'alerte si le formulaire a changé et on tente de changer la page (unload)
    const prepareUnload = function()
    {
        $(this).each(function(index, el) {
            const $this = $(this);
            $(this).on('submit',function(event) {
                $(window).off('beforeunload');
            });
            
            $(window).off('beforeunload').on('beforeunload',function() {
                if($this.triggerHandler('form:hasChanged'))
                return $this.attr('data-unload');
            });
        });
        
        return this;
    };
    
    return this;
}