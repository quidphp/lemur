"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// input
// script with behaviours related to general inputs

// valSet
// prend un set de input et textarea et crée un set avec les valeurs
// un séparateur peut être fourni
quid.main.valSet = $.fn.valSet = function(separator,trim) 
{
    var r = '';
    
    if(quid.base.isStringNotEmpty(separator))
    {
        $(this).each(function(index) {
            r += (r.length)? separator:"";
            r += $(this).inputValue(trim);
        });
    }
    
    return r;
}


// inputGroup
// retourne un objet jQuery avec tous les inputs de même type et même nom
quid.main.inputGroup = $.fn.inputGroup = function()
{
    var $this = $();
    
    $(this).each(function(index) {
        var name = $(this).prop("name");
        var type = $(this).prop("type");
        
        if(quid.base.isStringNotEmpty(name) && quid.base.isStringNotEmpty(type))
        $this = $this.add($("[type='"+type+"'][name='"+name+"']"));
    });
    
    return $this;
}


// focusFirst
// met le focus sur le premier input vide
quid.main.focusFirst = $.fn.focusFirst = function()
{
    $(this).filter(function() {
        return !$(this).inputValue(true);
    }).first().focus();
    
    return this;
}


// labels
// retourne le ou les labels liés à un élément de formulaire
quid.main.labels = $.fn.labels = function()
{
    var r = $();
    var id = $(this).prop('id');
    
    if(quid.base.isScalar(id))
    r = $(document).find("label[for='"+id+"']");
    
    return r;
}


// focusSlide
// permet de slideDown/up une target lors du focus sur un input
quid.main.focusSlide = $.fn.focusSlide = function(target) 
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


// inputValue
// retourne la valeur pour un input ou un fakeinput
// la valeur retourné peut être trim
quid.main.inputValue = $.fn.inputValue = function(trim)
{
    var r = null;

    if($(this).triggerHandler('input:isFake') === true)
    r = $(this).triggerHandler('input:getValue');
    
    else
    r = $(this).val();
    
    if(r == null)
    r = '';
    
    if(trim === true)
    r = String(r).trim();
    
    return r;
}