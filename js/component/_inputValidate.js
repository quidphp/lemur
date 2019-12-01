/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputValidate
// gère les événements relatifs à la validation d'un champ
Component.inputValidate = function() {
    
    $(this).on('change', function(event) {
        triggerCustom(this,'validate:process');
    })
    .on('focus', function(event) {
        triggerCustom(this,"validate:valid");
    })
    .on('focusout', function(event) {
        triggerCustom(this,'validate:process');
    })
    .on('validate:process', function(event) {
        triggerCustom(this,Dom.value(this,true)? 'validate:trigger':'validate:pattern validate:empty');
    })
    .on('validate:binded', function(event) {
        return true;
    })
    .on('validate:isEmpty',function(event) {
        return (!Dom.value(this,true))? true:false;
    })
    .on('validate:isValid',function(event) {
        return (trigger.call(this) === true)? true:false;
    })
    .on('validate:isNotEmptyAndValid',function(event) {
        return (!triggerFunc(this,'validate:isEmpty') && triggerFunc(this,'validate:isValid'))? true:false;
    })
    .on('validate:required', function(event) {
        event.stopPropagation();
        triggerCustom(this,(required.call(this) === true)? 'validate:valid':'validate:invalid');
    })
    .on('validate:pattern', function(event) {
        event.stopPropagation();
        triggerCustom(this,(pattern.call(this) === true)? 'validate:valid':'validate:invalid');
    })
    .on('validate:trigger', function(event) {
        let r = trigger.call(this);
        event.stopPropagation();
        triggerCustom(this,(r === true)? 'validate:valid':'validate:invalid');
        triggerCustom(this,(Dom.value(this,true))? 'validate:notEmpty':'validate:empty');
        
        return r;
    })
    .on('validate:valid', function(event) {
        if($(this).is("[type='checkbox'],[type='radio']"))
        {
            const group = Selector.inputGroup(this);
            group.not($(this)).attr('data-validate','valid');
        }
        
        $(this).attr('data-validate','valid');
    })
    .on('validate:invalid', function(event) {
        $(this).attr('data-validate','invalid');
    });
    
    
    // trigger
    // validate un élément de formulaire, utilise required et pattern
    const trigger = function() 
    {
        let r = false;
        
        if($(this).length)
        {
            r = required.call(this)
            
            if(r === true)
            r = pattern.call(this)
        }
        
        return r;
    }


    // required
    // validate un élément de formulaire, uniquemment avec required
    // required peut être numérique pour checkbox et radio, à ce moment c'est un min count
    // les input disabled ne sont pas considéré
    let required = function() 
    {
        let r = false;
        
        if($(this).length)
        {
            r = true;
            
            $(this).each(function(index) {
                const name = $(this).prop('name');
                const disabled = $(this).prop('disabled');
                let required = $(this).attr("data-required");
                
                if(!disabled && Num.is(required) && required > 0)
                {
                    if($(this).is("[type='checkbox'],[type='radio']"))
                    {
                        const checked = ($(this).prop("checked") === true)? 1:0;
                        const group = $(this).inputGroup();
                        const amount = group.filter(":checked").not($(this)).length;
                        
                        if((checked + amount) < required)
                        r = false;
                    }
                    
                    else if(!Dom.value(this,true).length)
                    r = false;
                }
                
                return r;
            });
        }
        
        return r;
    }


    // pattern
    // validate un élément de formulaire, uniquemment avec pattern
    // les input disabled ne sont pas considéré
    const pattern = function() 
    {
        let r = false;
        
        if($(this).length)
        {
            r = true;
            
            $(this).each(function(index) {
                const disabled = $(this).prop('disabled');
                const pattern = $(this).attr("data-pattern");
                const val = Dom.value(this,true);
                
                if(!disabled && Str.isNotEmpty(pattern) && val.length)
                {
                    pattern = new RegExp(pattern);
                    r = pattern.test(val);
                }
                
                return r;
            });
        }
        
        return r;
    }
    
    return this;
};