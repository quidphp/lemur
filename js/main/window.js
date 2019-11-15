"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// window
// script containing logic related to window and scrolling
quid.main.window = new function() {
    
    // openSmall
    // permet l'ouverture d'une smallWindow
    // tous les paramètres de la window sont dans la balise
    this.openSmall = $.fn.smallWindow = function()
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
            
            if(quid.base.number.is(width) && quid.base.number.is(height) && quid.base.number.is(x) && quid.base.number.is(y))
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
    this.resizeChange = $.fn.resizeChange = function()
    {
        var $this = $(this);
        $(window).on('resize.document-mount', function(event) {
            $this.trigger('resize:change');
        });
        
        return this;
    }


    // scrollChange
    // permet de notifier un objet jQuery du changement de scroll
    this.scrollChange = $.fn.scrollChange = function()
    {
        var $this = $(this);
        $(window).on('scroll.document-mount', function(event) {
            $this.trigger('scroll:change');
        });
        
        return this;
    }


    // hashchange
    // renvoie l'événement haschange aux objets jquerys
    this.hashchange = $.fn.hashchange = function()
    {
        var $this = $(this);
        $(window).on('hashchange.document-mount', function(event,sourceEvent) {
            $this.trigger('hash:change',[quid.base.request.fragment(),sourceEvent]);
        });
        
        return this;
    }


    // alert
    // lance un message d'alerte lorsqu'un événement est triggé
    this.alert = $.fn.alert = function(type)
    {
        if(quid.base.str.isNotEmpty(type))
        {
            $(this).on(type, function(event) {
                var alertText = $(this).data('alert');
                
                if(quid.base.str.isNotEmpty(alertText))
                alert(alertText);
            });
        }
        
        return this;
    }


    // confirm
    // demande une confirmation avant d'envoyer le formulaire
    // empêche le submit si confirm est faux
    this.confirm = $.fn.confirm = function(type) 
    {
        if(quid.base.str.isNotEmpty(type))
        {
            $(this).on(type, function(event) {
                var confirmText = $(this).data('confirm');
                
                if(quid.base.str.isNotEmpty(confirmText) && !confirm(confirmText))
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
    this.fragment = $.fn.fragment = function() 
    {
        $(this).on('fragment:get', function(event) {
            return $(this).data('fragment');
        })
        .on('fragment:update', function(event,replaceState) {
            var current = quid.base.request.fragment();
            var fragment = $(this).triggerHandler('fragment:get');
            var hasHistoryApi = $(document).triggerHandler('document:hasHistoryApi');
            
            if(current !== fragment)
            {
                if(quid.base.str.isNotEmpty(fragment))
                {
                    var fragmentHash = '#'+fragment;
                    
                    if(hasHistoryApi === true && replaceState === true)
                    $(document).triggerHandler('document:replaceState',quid.base.request.relative()+fragmentHash);
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
            $(document).triggerHandler('document:replaceState',quid.base.request.relative());
            else
            window.location.hash = '';
        });
        
        return this;
    }
}