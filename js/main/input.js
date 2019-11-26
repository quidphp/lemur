"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// input
// script with behaviours related to general inputs
quid.main.input = new function() {
    
    // bind
    // permet d'appliquer les bindings de base sur un input
    this.bind = function() {
        
        // triggerHandler
        $(this).on('input:isDisabled',  function(event) {
            return ($(this).prop('disabled') === true)? true:false;
        })
        .on('input:getValue', function(event) {
            return String($(this).val());
        })
        
        // trigger
        .on('input:disable', function(event) {
            $(this).prop('disabled',true);
        })
        .on('input:enable', function(event) {
            $(this).prop('disabled',false);
        })
        .on('input:prepareDisable', function(event) {
            $(this).trigger($(this).triggerHandler('input:isDisabled')? 'input:enable':'input:disable');
        });
        
        return this;
    };
    
    
    // val
    // retourne la valeur pour un input ou un fakeinput
    // la valeur retourné peut être trim
    this.val = $.fn.inputValue = function(trim)
    {
        var r = null;

        r = $(this).val();
        
        if(r != null)
        {
            r = String(r);
            
            if(trim === true)
            r = r.trim();
        }
        
        return r;
    }
    
    
    // valSet
    // prend un set de input et textarea et crée un set avec les valeurs
    // un séparateur peut être fourni
    this.valSet = $.fn.valSet = function(separator,trim) 
    {
        var r = '';
        
        if(quid.base.str.isNotEmpty(separator))
        {
            $(this).each(function(index) {
                r += (r.length)? separator:"";
                r += $(this).inputValue(trim);
            });
        }
        
        return r;
    }


    // group
    // retourne un objet jQuery avec tous les inputs de même type et même nom
    this.group = $.fn.inputGroup = function()
    {
        var $this = $();
        
        $(this).each(function(index) {
            var name = $(this).prop("name");
            var type = $(this).prop("type");
            
            if(quid.base.str.isNotEmpty(name) && quid.base.str.isNotEmpty(type))
            $this = $this.add($("[type='"+type+"'][name='"+name+"']"));
        });
        
        return $this;
    }


    // focusFirst
    // met le focus sur le premier input vide
    this.focusFirst = $.fn.focusFirst = function()
    {
        $(this).filter(function() {
            return !$(this).inputValue(true);
        }).first().focus();
        
        return this;
    }


    // labels
    // retourne le ou les labels liés à un élément de formulaire
    this.labels = $.fn.labels = function()
    {
        var r = $();
        var id = $(this).prop('id');
        
        if(quid.base.scalar.is(id))
        r = $(document).find("label[for='"+id+"']");
        
        return r;
    }


    // focusSlide
    // permet de slideDown/up une target lors du focus sur un input
    this.focusSlide = $.fn.focusSlide = function(target) 
    {
        if($(this).length === 1 && target instanceof jQuery)
        {
            $(this).on('focus', function() {
                target.slideDown("fast");
            })
            .on('focusout', function() {
                target.slideUp("fast");
            });
        }
        
        return this;
    }
}