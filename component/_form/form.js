"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// form
// script with behaviours for a form component
quid.core.form = function() {
    
    // block
    quid.main.event.block.call(this,'submit');
    
    // triggerHandler
    $(this).on('form:getFields', function(event) {
        return $(this).find("input,select,textarea,button[type='submit']");
    })
    .on('form:getSystemFields', function(event) {
        return $(this).triggerHandler('form:getFields').filter("[name^='-']");
    })
    .on('form:getTargetFields', function(event) {
        return $(this).triggerHandler('form:getFields').not(':disabled').filter("[name]").not("[name^='-']");
    })
    .on('form:getValidateFields', function(event) {
        return $(this).triggerHandler('form:getTargetFields').filter("[data-required],[data-pattern]");
    })
    .on('form:getValidateField', function(event) {
        return $(this).triggerHandler('form:getValidateFields').first();
    })
    .on('form:hasFiles', function(event) {
        return ($(this).triggerHandler('form:getTargetFields').filter("input[type='file']").length)? true:false;
    })
    .on('form:getSubmits', function(event) {
        return $(this).triggerHandler('form:getFields').filter("[type='submit'],[type='image']");
    })
    .on('form:getSubmit', function(event) {
        return $(this).triggerHandler('form:getSubmits').first();
    })
    .on('form:getClickedSubmit', function(event) {
        return $(this).triggerHandler('form:getSubmits').filter("[data-submit-click]").first();
    })
    .on('form:getClickedSubmits', function(event) {
        var r = $(this).triggerHandler('form:getClickedSubmit');
        
        if(r.length)
        {
            var name = r.prop('name');
            if(quid.base.str.isNotEmpty(name))
            r = $(this).triggerHandler('form:getSubmits').filter("[name='"+name+"']");
        }
        
        return r;
    })
    .on('form:getCsrfField', function(event) {
        return $(this).triggerHandler('form:getSystemFields').filter("[data-csrf='1']").first();
    })
    .on('form:getGenuineField', function(event) {
        return $(this).triggerHandler('form:getSystemFields').filter("[data-genuine='1']").first();
    })
    .on('form:hasChanged', function(event) {
        var r = false;
        var target = $(this).triggerHandler('form:getTargetFields');
        var serialize = target.serialize();
        var original = $(this).data('form:serialize');
        
        if(original && serialize !== original)
        r = true;
        
        return r;
    })
    
    // prepare
    .on('form:prepare', function(event) {
        prepareGenuine.call(this);
        prepareHasChanged.call(this);
    })
    
    // setup
    .one('form:setup', function(event) {
        if(!$(this).is("[data-skip-form-prepare='1']"))
        $(this).trigger('form:prepare');
        
        // click sur submit, met un attribut data-clicked
        var submits = $(this).triggerHandler('form:getSubmits');
        submits.on('click', function(event) {
            submits.removeAttr('data-submit-click');
            $(this).attr('data-submit-click',true);
        });
        
        // validation
        if(!$(this).is("[data-validation='0']"))
        $(this).validatePrevent('submit');
        
        // formUnload
        if($(this).is("[data-unload]"))
        prepareUnload.call(this);
        
        // block
        if(!$(this).is("[data-block='0']"))
        {
            $(this).on('submit', function(event) {
                $(this).trigger('block');
            });
        }
    })
    
    // prepareGenuine
    var prepareGenuine = function() {
        var genuine = $(this).triggerHandler('form:getGenuineField');
        if(genuine.length === 1)
        {
            var name = genuine.prop('name');
            var newName = name+"2-";
            var newValue = 1;
            var genuine2 = "<input type='hidden' name='"+newName+"' value='"+newValue+"' />";
            $(this).prepend(genuine2);
        }
    };
    
    // prepareHasChanged
    var prepareHasChanged = function() {
        var target = $(this).triggerHandler('form:getTargetFields');
        var serialize = target.serialize();
        $(this).data('form:serialize',serialize);
    };
    
    // prepareUnload
    // permet d'ajouter un message d'alerte si le formulaire a changé et on tente de changer la page (unload)
    var prepareUnload = function()
    {
        $(this).each(function(index, el) {
            var $this = $(this);
            $(this).on('submit', function(event) {
                $(window).off('beforeunload');
            });
            
            $(window).off('beforeunload').on('beforeunload', function() {
                if($this.triggerHandler('form:hasChanged'))
                return $this.attr('data-unload');
            });
        });
        
        return this;
    };
    
    return this;
}