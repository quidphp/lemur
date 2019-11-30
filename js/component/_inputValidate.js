/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputValidate
// gère les événements relatifs à la validation d'un champ
quid.component.inputValidate = function() {
    
    $(this).on('change', function(event) {
        $(this).trigger('validate:process');
    })
    .on('focus', function(event) {
        $(this).trigger("validate:valid");
    })
    .on('focusout', function(event) {
        $(this).trigger('validate:process');
    })
    .on('validate:process', function(event) {
        $(this).trigger(quid.node.value(this,true)? 'validate:trigger':'validate:pattern validate:empty');
    })
    .on('validate:binded', function(event) {
        return true;
    })
    .on('validate:isEmpty',function(event) {
        return (!quid.node.value(this,true))? true:false;
    })
    .on('validate:isValid',function(event) {
        return (trigger.call(this) === true)? true:false;
    })
    .on('validate:isNotEmptyAndValid',function(event) {
        return (!$(this).triggerHandler('validate:isEmpty') && $(this).triggerHandler('validate:isValid'))? true:false;
    })
    .on('validate:required', function(event) {
        event.stopPropagation();
        $(this).trigger((required.call(this) === true)? 'validate:valid':'validate:invalid');
    })
    .on('validate:pattern', function(event) {
        event.stopPropagation();
        $(this).trigger((pattern.call(this) === true)? 'validate:valid':'validate:invalid');
    })
    .on('validate:trigger', function(event) {
        var r = trigger.call(this);
        event.stopPropagation();
        $(this).trigger((r === true)? 'validate:valid':'validate:invalid');
        $(this).trigger((quid.node.value(this,true))? 'validate:notEmpty':'validate:empty');
        
        return r;
    })
    .on('validate:valid', function(event) {
        if($(this).is("[type='checkbox'],[type='radio']"))
        {
            var group = quid.selector.inputGroup(this);
            group.not($(this)).attr('data-validate','valid');
        }
        
        $(this).attr('data-validate','valid');
    })
    .on('validate:invalid', function(event) {
        $(this).attr('data-validate','invalid');
    });
    
    
    // trigger
    // validate un élément de formulaire, utilise required et pattern
    var trigger = function() 
    {
        var r = false;
        
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
    var required = function() 
    {
        var r = false;
        
        if($(this).length)
        {
            r = true;
            
            $(this).each(function(index) {
                var name = $(this).prop('name');
                var disabled = $(this).prop('disabled');
                var required = $(this).attr("data-required");
                
                if(!disabled && quid.number.is(required) && required > 0)
                {
                    if($(this).is("[type='checkbox'],[type='radio']"))
                    {
                        var checked = ($(this).prop("checked") === true)? 1:0;
                        var group = $(this).inputGroup();
                        var amount = group.filter(":checked").not($(this)).length;
                        
                        if((checked + amount) < required)
                        r = false;
                    }
                    
                    else if(!quid.node.value(this,true).length)
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
    var pattern = function() 
    {
        var r = false;
        
        if($(this).length)
        {
            r = true;
            
            $(this).each(function(index) {
                var disabled = $(this).prop('disabled');
                var pattern = $(this).attr("data-pattern");
                var val = quid.node.value(this,true);
                
                if(!disabled && quid.str.isNotEmpty(pattern) && val.length)
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