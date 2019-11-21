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
quid.core.enumSet = function()
{
    $(this).on('getCurrent', function(event) {
        return $(this).find(".current");
    })
    .on('enumSet:getResult', function(event) {
        return $(this).triggerHandler('clickOpen:getTarget').find(".results");
    })
    .on('enumSet:getChoice', function(event) {
        return $(this).triggerHandler('getCurrent').find('.choice');
    })
    .on('enumSet:getInput', function(event) {
        return $(this).find(".input input[type='text']");
    })
    .on('enumSet:getButton', function(event) {
        return $(this).find(".input button[type='button']");
    })
    .on('enumSet:getOrder', function(event) {
        return $(this).triggerHandler('clickOpen:getTarget').find(".order :input").last();
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
        return ((quid.base.scalar.is(value)) && $(this).triggerHandler('enumSet:getRadioCheckbox').filter("[value='"+value+"']").length)? true:false;
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
        
        if(quid.base.str.isNotEmpty(html) && quid.base.scalar.is(value) && quid.base.str.isNotEmpty(mode))
        {
            var button = $(this).triggerHandler('clickOpen:getTarget').find("li > button[data-value='"+value+"']");
            if($(this).triggerHandler('enumSet:isChoiceIn',[value]))
            button.addClass('already-in');
            
            else
            {
                if(mode === 'enum')
                $(this).trigger('choice:empty');
                else
                button.removeClass('already-in');
                
                $(this).triggerHandler('getCurrent').append(html);
                $(this).trigger('clickOpen:close');
            }
        }
    })
    .on('choice:empty', function(event) {
        $(this).triggerHandler('enumSet:getChoice').remove();
        $(this).triggerHandler('clickOpen:getTarget').find("li.already-in").removeClass('already-in');
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
quid.core.enumSetInput = function()
{
    $(this).enterCatch(true,'keyup keydown').validatePrevent('ajax:init').block('ajax:init').timeout('keyup',500).ajax('ajax:init')
    .on('enter:blocked', function(event,keyEvent) {
        if(keyEvent.type === 'keyup')
        $(this).trigger('ajax:beforeInit',[false]);
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
        $(this).trigger('validate:valid');
        
        if(validate !== true || quid.base.str.isNotEmpty(val))
        {
            $(this).trigger('keyup:clearTimeout');
            $(this).trigger('ajax:init');
        }
        
        else
        $(this).triggerHandler('enumSetInput:getParent').trigger('clickOpen:close');
        
        $(this).data('valueLast',val);
    })
    .on('validate:failed', function(event) {
        $(this).triggerHandler('enumSetInput:getTarget').trigger('clickOpen:close');
    })
    .on('enumSetInput:getParent', function(event) {
        return $(this).parents(".specific-component");
    })
    .on('enumSetInput:getTarget', function(event) {
        return $(this).triggerHandler('enumSetInput:getParent').triggerHandler('clickOpen:getTarget');
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
        var target = $(this).triggerHandler('enumSetInput:getTarget');
        var result = $(this).triggerHandler('enumSetInput:getResult');
        result.html(data);
        target.trigger('clickOpen:ready');
    })
    .on('ajax:error', function(event,parsedError,jqXHR,textStatus,errorThrown) {
        $(this).triggerHandler('enumSetInput:getResult').html(parsedError);
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
quid.core.enumSetFull = function()
{
    var $this = this;
    $(this).each(function(index, el) {
        var enumSet = $(this);
        
        // enumSet
        $(this).callThis(quid.core.clickOpenWithTrigger,"> .trigger")
        .callThis(quid.core.enumSet)
        .on('enumSet:getMode', function(event) {
            return $(this).parents(".form-element").data('mode');
        })
        .on('clickOpen:ready', function(event) {
            $(this).triggerHandler('clickOpen:getTarget').trigger('feed:bind');
        }).on('clickOpen:getBackgroundFrom', function(event) {
            return 'enumSet';
        })
        
        // target
        $(this).triggerHandler('clickOpen:getTarget')
        .callThis(quid.core.appendContainer)
        .on('feed:target', function(event) {
            return $(this).find(".results ul:first-child");
        })
        .on('feed:loadMoreRemove', function(event,loadMore) {
            return loadMore.parent('li');
        })
        .on('feed:parseData', function(event,data) {
            return quid.main.dom.parseHtml(data).find("li");
        })
        .on('click', 'li > button', function(event) {
            enumSet.trigger('choice:append',[$(this).data('value'),$(this).data('html')]);
            event.stopPropagation();
        });
        
        // input
        var input = $(this).triggerHandler('enumSet:getInput');
        input.callThis(quid.core.enumSetInput);
        $(this).triggerHandler('enumSet:getOrder').on('change', function(event) {
            enumSet.triggerHandler('enumSet:getInput').trigger('ajax:beforeInit',[false]);
        });
        
        // button
        $(this).triggerHandler('enumSet:getButton').on('click',function(event) {
            event.stopPropagation();
            input.val("");
            input.trigger('ajax:beforeInit');
        });
    });
    
    return this;
}