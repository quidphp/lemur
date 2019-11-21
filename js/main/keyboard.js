"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboard
// script with functions related to keyboard keys catching, blocking and handling
quid.main.keyboard = new function() {
    var $that = this;
    
    // catch
    // permet d'attraper une touche au clavier
    // l'événement par défaut est keydown
    this.catch = function(key,values,type) {
        type = type || 'keydown';
        
        if(quid.base.str.isNotEmpty(key) && quid.base.arr.isNotEmpty(values))
        {
            $(this).on(type, function(event) {
                
                if(quid.base.arr.in(event.keyCode,values))
                {
                    var isInput = $(event.target).is(':input');
                    var catched = key+":catched";
                    $(this).trigger(catched,[event,isInput,event.keyCode]);
                    
                    var prevent = key+":prevent";
                    if($(this).triggerHandler(prevent,[event,isInput,event.keyCode]) === true)
                    {
                        var blocked = key+":blocked";
                        event.stopImmediatePropagation();
                        event.preventDefault();
                        $(this).trigger(blocked,[event,isInput,event.keyCode]);
                        return false;
                    }
                }
            })
        }
        
        return this;
    }
    
    
    // enter
    // attrape la touche enter, par défaut l'événement est prevent
    this.enter = $.fn.enterCatch = function(prevent,type)
    {
        $that.catch.call(this,'enter',[10,13],type);
        
        $(this).on('enter:prevent', function(event) {
            return (prevent === true)? true:false;
        });        
        
        return this;
    }

    
    // escape
    // attrape la touche escape, par défaut l'événement est prevent
    this.escape = $.fn.escapeCatch = function(prevent,type)
    {
        $that.catch.call(this,'escape',[27],type);
        
        $(this).on('escape:prevent', function(event) {
            return (prevent === true)? true:false;
        });    
        
        return this;
    }
    
    
    // tab
    // attrape la touche tab, par défaut l'événement est prevent
    this.tab = $.fn.tabCatch = function(prevent,type)
    {
        $that.catch.call(this,'tab',[9],type);
        
        $(this).on('tab:prevent', function(event) {
            return (prevent === true)? true:false;
        });    
        
        return this;
    }
    
    
    // arrow
    // attrape les touches de flèche sur le clavier
    // par défaut l'événement est prevent
    this.arrow = $.fn.arrowCatch = function(prevent,type) 
    {
        $that.catch.call(this,'arrow',[37,38,39,40],type);
        
        $(this).on('arrow:catched', function(event,keyEvent,isInput,keyCode) {
            if(keyCode === 38)
            $(this).trigger('arrowUp:catched',[keyEvent,isInput]);
            
            else if(keyCode === 40)
            $(this).trigger('arrowDown:catched',[keyEvent,isInput]);
            
            else if(ekeyCode === 37)
            $(this).trigger('arrowLeft:catched',[keyEvent,isInput]);
            
            else if(keyCode === 39)
            $(this).trigger('arrowRight:catched',[keyEvent,isInput]);
        })
        .on('arrow:prevent', function(event) {
            return (prevent === true)? true:false;
        });  
        
        return this;
    }
}