"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// enumSet
// script for an enumSet component (search in a relation)

// enumSet
// gère les comportements pour le popup enumSet
quid.core.enumSet = $.fn.enumSet = function()
{
    $(this).on('getCurrent', function(event) {
        return $(this).find(".current");
    })
    .on('enumSet:getResult', function(event) {
        return $(this).triggerHandler('clickOpen:getPopup').find(".results");
    })
    .on('enumSet:getChoice', function(event) {
        return $(this).triggerHandler('getCurrent').find('.choice');
    })
    .on('enumSet:getInput', function(event) {
        return $(this).find(".input input[type='text']");
    })
    .on('enumSet:getOrder', function(event) {
        return $(this).triggerHandler('clickOpen:getPopup').find(".order :input").first();
    })
    .on('enumSet:getRadioCheckbox', function(event) {
        return $(this).triggerHandler('enumSet:getChoice').find("input[type='checkbox'],input[type='radio']");
    })
    .on('enumSet:getMode', function(event) {
        return $(this).data('mode');
    })
    .on('enumSet:getChoiceCount', function(event) {
        return $(this).triggerHandler('enumSet:getChoice').length;
    })
    .on('enumSet:isChoiceIn', function(event,value) {
        return ((quid.base.isScalar(value)) && $(this).triggerHandler('enumSet:getRadioCheckbox').filter("[value='"+value+"']").length)? true:false;
    })
    .on('clickOpen:open', function(event) {
        $(this).attr('data-status','loading');
        $(this).triggerHandler('enumSet:getResult').html('');
    })
    .on('clickOpen:close', function(event) {
        $(this).removeAttr('data-status');
        $(this).triggerHandler('enumSet:getResult').html('');
    })
    .on('choice:append', function(event,value,html) {
        var mode = $(this).triggerHandler('enumSet:getMode');

        if(quid.base.isStringNotEmpty(html) && quid.base.isScalar(value) && quid.base.isStringNotEmpty(mode))
        {
            var ele = $(this).triggerHandler('clickOpen:getPopup').find("li[data-value='"+value+"']");
            if($(this).triggerHandler('enumSet:isChoiceIn',[value]))
            ele.addClass('already-in');
            
            else
            {
                if(mode === 'enum')
                $(this).trigger('choice:empty');
                else
                ele.removeClass('already-in');
                
                $(this).triggerHandler('getCurrent').append(html);
                $(this).trigger('clickOpen:close');
            }
        }
    })
    .on('choice:empty', function(event) {
        $(this).triggerHandler('enumSet:getChoice').remove();
        $(this).triggerHandler('clickOpen:getPopup').find("li.already-in").removeClass('already-in');
    })
    .on('click', "input[type='radio']", function(event) {
        $(this).prop('checked',false);
        $(this).parents(".choice").remove();
    })
    .on('change', "input[type='checkbox']", function(event) {
        if($(this).prop('checked') === false)
        $(this).parents(".choice").remove();
    })
    
    return this;
}


// enumSetInput
// gère les comportements pour champ enumSet avec recherche de relation
quid.core.enumSetInput = $.fn.enumSetInput = function()
{
    $(this).enterBlock().validatePrevent('ajax:init').block('ajax:init').timeout('keyup',500).ajax('ajax:init')
    .on('enter:blocked', function(event) {
        $(this).trigger('ajax:beforeInit',[true]);
    })
    .on('keyup:onTimeout', function(event) {
        if($(this).is(":focus"))
        $(this).trigger('ajax:beforeInit',[true]);
    })
    .on('click', function(event) {
        event.stopPropagation();
        
        if($(this).triggerHandler('validate:isNotEmptyAndValid') && $(this).triggerHandler('enumSetInput:hasChanged'))
        $(this).trigger('ajax:beforeInit',[true]);
    })
    .on('enumSetInput:hasChanged', function(event) {
        var r = false;
        var isOpen = $(this).triggerHandler('enumSetInput:getParent').triggerHandler('clickOpen:isOpen');
        
        if(isOpen === false || ($(this).inputValue(true) !== $(this).data('valueLast')))
        r = true;
        
        return r;
    })
    .on('ajax:beforeInit', function(event,validate) {
        var val = $(this).inputValue(true);            
        $(this).removeClass('invalid');
        
        if(validate !== true || quid.base.isStringNotEmpty(val))
        {
            $(this).trigger('keyup:clearTimeout');
            $(this).trigger('ajax:init');
        }
        
        else
        $(this).triggerHandler('getParent').trigger('clickOpen:close');
        
        $(this).data('valueLast',val);
    })
    .on('validate:failed', function(event) {
        $(this).triggerHandler('getPopup').trigger('clickOpen:close');
    })
    .on('enumSetInput:getParent', function(event) {
        return $(this).parents(".search-enumset");
    })
    .on('enumSetInput:getPopup', function(event) {
        return $(this).triggerHandler('enumSetInput:getParent').triggerHandler('clickOpen:getPopup');
    })
    .on('enumSetInput:getResult', function(event) {
        return $(this).triggerHandler('enumSetInput:getParent').triggerHandler('enumSet:getResult');
    })
    .on('enumSetInput:getOrder', function(event) {
        return $(this).triggerHandler('enumSetInput:getParent').triggerHandler('enumSet:getOrder');
    })
    .on('ajax:getHref', function(event) {
        var parent = $(this).triggerHandler('enumSetInput:getParent');
        var select = $(this).triggerHandler('enumSetInput:getOrder');
        var radioCheckbox = parent.triggerHandler('enumSet:getRadioCheckbox');
        var separator = $(this).data("separator");
        var selected = radioCheckbox.filter(":checked").valSet(separator,true) || separator;
        var selectVal = select.inputValue(true);
        var order = (select.length && selectVal)? selectVal:separator;
        return $(this).dataHrefReplaceChar(selected,order);
    })
    .on('ajax:getData', function(event) {
        var r = {};
        r[$(this).data('query')] = $(this).inputValue(true);
        return r;
    })
    .on('ajax:before', function() {
        $(this).trigger('block');
        $(this).triggerHandler('enumSetInput:getParent').trigger('clickOpen:open');
    })
    .on('ajax:success', function(event,data,textStatus,jqXHR) {
        var popup = $(this).triggerHandler('enumSetInput:getPopup');
        var result = $(this).triggerHandler('enumSetInput:getResult');
        result.html(data);
        popup.trigger('clickOpen:ready');
    })
    .on('ajax:error', function(event,jqXHR,textStatus,errorThrown) {
        $(this).triggerHandler('enumSetInput:getResult').html(quid.core.parseError(jqXHR,textStatus));
    })
    .on('ajax:complete', function() {
        $(this).triggerHandler('enumSetInput:getParent').removeAttr('data-status');
        $(this).trigger('unblock');
    })
    
    return this;
}


// enumSetFull
// input enumSet complet avec popup et bouton
// aussi append container
quid.core.enumSetFull = $.fn.enumSetFull = function()
{
    var $this = this;
    $(this).each(function(index, el) {
        var enumSet = $(this);
        
        // enumSet
        $(this).clickOpenWithTrigger("> .trigger").enumSet().on('clickOpen:ready', function(event) {
            $(this).triggerHandler('clickOpen:getPopup').trigger('feed:bind');
        }).on('clickOpen:getBackgroundFrom', function(event) {
            return 'enumSet';
        })
        
        // popup
        $(this).triggerHandler('clickOpen:getPopup').appendContainer().on('feed:target', function(event) {
            return $(this).find(".results ul:first-child");
        })
        .on('feed:parseData', function(event,data) {
            return quid.core.parseHtmlDocument(data).find("li");
        })
        .on('click', 'li', function(event) {
            $(this).parents(".search-enumset").trigger('choice:append',[$(this).data('value'),$(this).data('html')]);
            event.stopPropagation();
        });
        
        // input
        $(this).triggerHandler('enumSet:getInput').enumSetInput();
        $(this).triggerHandler('enumSet:getOrder').on('change', function(event) {
            setTimeout(function() {
                enumSet.triggerHandler('enumSet:getInput').trigger('ajax:beforeInit',[false]);
            },50);
        });
        
        // button
        $(this).find("button").on('enumSet:getInput', function(event) {
            return $(this).parents(".search-enumset").triggerHandler('enumSet:getInput');
        })
        .on('click',function(event) {
            event.stopPropagation();
            var input = $(this).triggerHandler('enumSet:getInput');
            input.val("");
            input.trigger('ajax:beforeInit');
        });
    });
    
    return this;
}