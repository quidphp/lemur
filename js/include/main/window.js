"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// window
// script containing logic related to window and scrolling

// smallWindow
// permet l'ouverture d'une smallWindow
// tous les paramètres de la window sont dans la balise
quid.main.smallWindow = $.fn.smallWindow = function()
{
    $(this).addIds('smallWindow');
    $(this).on('click', function(event) {
        var win = window;
        var href = $(this).attr('href');
        var id = $(this).prop('id');
        var width = $(this).data('width') || 1000;
        var height = $(this).data('height') || 1000;
        var x = $(this).data('x') || 0;
        var y = $(this).data('y') || 0;
        
        if($.isNumeric(width) && $.isNumeric(height) && $.isNumeric(x) && $.isNumeric(y))
        {
            event.preventDefault();
            var param = "toolbar=no ,left="+x+",top="+y+",width="+width+",height="+height+",location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no";
            var child = win.open(href,id,param);
            child.focus();
            win.blur();
            return false;
        }
    });
    
    return this;
}


// resizeChange
// permet de notifier un objet jQuery du redimensionnement de l'écran
quid.main.resizeChange = $.fn.resizeChange = function()
{
    var $this = $(this);
    $(window).on('scroll', function(event) {
        $this.trigger('resize:change');
    });
    
    return this;
}


// scrollChange
// permet de notifier un objet jQuery du changement de scroll
quid.main.scrollChange = $.fn.scrollChange = function()
{
    var $this = $(this);
    $(window).on('scroll', function(event) {
        $this.trigger('scroll:change');
    });
    
    return this;
}


// hashchange
// renvoie l'événement haschange aux objets jquerys
quid.main.hashchange = $.fn.hashchange = function()
{
    var $this = $(this);
    $(window).on('hashchange', function(event,sourceEvent) {
        $this.trigger('hash:change',[quid.base.fragment(),sourceEvent]);
    });
    
    return this;
}


// alert
// lance un message d'alerte lorsqu'un événement est triggé
quid.main.alert = $.fn.alert = function(type)
{
    if(quid.base.isStringNotEmpty(type))
    {
        $(this).on(type, function(event) {
            var alertText = $(this).data('alert');
            
            if(quid.base.isStringNotEmpty(alertText))
            alert(alertText);
        });
    }
    
    return this;
}


// confirm
// demande une confirmation avant d'envoyer le formulaire
// empêche le submit si confirm est faux
quid.main.confirm = $.fn.confirm = function(type) 
{
    if(quid.base.isStringNotEmpty(type))
    {
        $(this).on(type, function(event) {
            var confirmText = $(this).data('confirm');
            
            if(quid.base.isStringNotEmpty(confirmText) && !confirm(confirmText))
            {
                event.stopImmediatePropagation();
                event.preventDefault();
                $(this).trigger('notConfirmed',[event]);
                return false;
            }
            
            else
            $(this).trigger('confirmed',[event]);
        });
    }
    
    return this;
}


// fragment
// gère les changements de fragment
quid.main.fragment = $.fn.fragment = function() 
{
    $(this).on('fragment:get', function(event) {
        return $(this).data('fragment');
    })
    .on('fragment:update', function(event,replaceState) {
        var current = quid.base.fragment();
        var fragment = $(this).triggerHandler('fragment:get');
        var hasHistoryApi = $(document).triggerHandler('document:hasHistoryApi');
        
        if(current !== fragment)
        {
            if(quid.base.isStringNotEmpty(fragment))
            {
                var fragmentHash = '#'+fragment;
                
                if(hasHistoryApi === true && replaceState === true)
                $(document).triggerHandler('document:replaceState',quid.base.currentRelativeUri()+fragmentHash);
                else
                window.location.hash = fragmentHash;
            }
            
            else
            $(this).trigger('fragment:remove',[replaceState]);
            
            $(this).trigger('fragment:updated',[fragment]);
        }
    })
    .on('fragment:remove', function(event) {
        if(hasHistoryApi === true && replaceState === true)
        $(document).triggerHandler('document:replaceState',quid.base.currentRelativeUri());
        else
        window.location.hash = '';
    });
    
    return this;
}