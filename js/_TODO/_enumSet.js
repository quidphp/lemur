/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// enumSet
// script for an enumSet component (search in a relation)
// input enumSet compconst avec popup et bouton, aussi append container
Component.enumSet = function()
{
    // bindEnumSet
    const bindEnumSet = function() {
        $(this).on('getCurrent',function(event) {
            return $(this).find(".current");
        })
        .on('enumSet:getResult',function(event) {
            return trigHdlr(this,'clickOpen:getTarget').find(".results");
        })
        .on('enumSet:getChoice',function(event) {
            return trigHdlr(this,'getCurrent').find('.choice');
        })
        .on('enumSet:getInput',function(event) {
            return $(this).find(".input input[type='text']");
        })
        .on('enumSet:getButton',function(event) {
            return $(this).find(".input button[type='button']");
        })
        .on('enumSet:getOrder',function(event) {
            return trigHdlr(this,'clickOpen:getTarget').find(".order :input").last();
        })
        .on('enumSet:getRadioCheckbox',function(event) {
            return trigHdlr(this,'enumSet:getChoice').find("input[type='checkbox'],input[type='radio']");
        })
        .on('enumSet:getMode',function(event) {
            return $(this).data('mode');
        })
        .on('enumSet:getChoiceCount',function(event) {
            return trigHdlr(this,'enumSet:getChoice').length;
        })
        .on('enumSet:isChoiceIn',function(event,value) {
            return ((Scalar.is(value)) && trigHdlr(this,'enumSet:getRadioCheckbox').filter("[value='"+value+"']").length)? true:false;
        })
        .on('clickOpen:open',function(event) {
            $(this).attr('data-status','loading');
            trigHdlr(this,'enumSet:getResult').html('');
        })
        .on('clickOpen:close',function(event) {
            $(this).removeAttr('data-status');
            trigHdlr(this,'enumSet:getResult').html('');
        })
        .on('choice:append',function(event,value,html) {
            const mode = trigHdlr(this,'enumSet:getMode');
            
            if(Str.isNotEmpty(html) && Scalar.is(value) && Str.isNotEmpty(mode))
            {
                const button = trigHdlr(this,'clickOpen:getTarget').find("li > button[data-value='"+value+"']");
                if(trigHdlr(this,'enumSet:isChoiceIn',[value]))
                button.addClass('already-in');
                
                else
                {
                    if(mode === 'enum')
                    trigEvt(this,'choice:empty');
                    else
                    button.removeClass('already-in');
                    
                    trigHdlr(this,'getCurrent').append(html);
                    trigEvt(this,'clickOpen:close');
                }
            }
        })
        .on('choice:empty',function(event) {
            trigHdlr(this,'enumSet:getChoice').remove();
            trigHdlr(this,'clickOpen:getTarget').find("li.already-in").removeClass('already-in');
        })
        .on('click', "input[type='radio']",function(event) {
            $(this).prop('checked',false);
            $(this).parents(".choice").remove();
        })
        .on('change', "input[type='checkbox']",function(event) {
            if($(this).prop('checked') === false)
            $(this).parents(".choice").remove();
        })
        
        return this;
    };
    
    // bindEnumSetInput
    const bindEnumSetInput = function() {
        Component.keyboardEnter.call(this,true,'keyup keydown');
        Component.validatePrevent.call(this,'ajax:init');
        Component.BlockEvent.call(this,'ajax:init');
        Component.Timeout.call(this,'keyup',500);
        Component.Ajax.call(this,'ajax:init');
        
        $(this).on('enter:blocked',function(event,keyEvent) {
            if(keyEvent.type === 'keyup')
            trigEvt(this,'ajax:beforeInit',false);
        })
        .on('keyup:onTimeout',function(event) {
            if($(this).is(":focus"))
            trigEvt(this,'ajax:beforeInit',true);
        })
        .on('click',function(event) {
            event.stopPropagation();

            if(trigHdlr(this,'validate:isNotEmptyAndValid') && trigHdlr(this,'enumSetInput:hasChanged'))
            trigEvt(this,'ajax:beforeInit',true);
        })
        .on('enumSetInput:hasChanged',function(event) {
            let r = false;
            const isOpen = trigHdlr(this,'enumSetInput:getParent').trigHdlr('clickOpen:isOpen');
            
            if(isOpen === false || (Dom.value(this,true) !== $(this).data('valueLast')))
            r = true;
            
            return r;
        })
        .on('ajax:beforeInit',function(event,validate) {
            const val = Dom.value(this,true);            
            trigEvt(this,'validate:valid');
            
            if(validate !== true || Str.isNotEmpty(val))
            {
                trigEvt(this,'keyup:clearTimeout');
                trigEvt(this,'ajax:init');
            }
            
            else
            trigHdlr(this,'enumSetInput:getParent').trigger('clickOpen:close');
            
            $(this).data('valueLast',val);
        })
        .on('validate:failed',function(event) {
            trigHdlr(this,'enumSetInput:getTarget').trigger('clickOpen:close');
        })
        .on('enumSetInput:getParent',function(event) {
            return $(this).parents(".specific-component");
        })
        .on('enumSetInput:getTarget',function(event) {
            return trigHdlr(this,'enumSetInput:getParent').trigHdlr('clickOpen:getTarget');
        })
        .on('enumSetInput:getResult',function(event) {
            return trigHdlr(this,'enumSetInput:getParent').trigHdlr('enumSet:getResult');
        })
        .on('enumSetInput:getOrder',function(event) {
            return trigHdlr(this,'enumSetInput:getParent').trigHdlr('enumSet:getOrder');
        })
        .on('ajax:getHref',function(event) {
            const parent = trigHdlr(this,'enumSetInput:getParent');
            const select = trigHdlr(this,'enumSetInput:getOrder');
            const radioCheckbox = parent.trigHdlr('enumSet:getRadioCheckbox');
            const separator = $(this).data("separator");
            const selected = Dom.valueSeparator(radioCheckbox.filter(":checked"),separator,true) || separator;
            const selectVal = Dom.value(select,true);
            const order = (select.length && selectVal)? selectVal:separator;
            return Dom.dataHrefReplaceChar(this,selected,order);
        })
        .on('ajax:getData',function(event) {
            let r = {};
            r[$(this).data('query')] = Dom.value(this,true);
            return r;
        })
        .on('ajax:before',function() {
            trigEvt(this,'block');
            trigHdlr(this,'enumSetInput:getParent').trigger('clickOpen:open');
        })
        .on('ajax:success',function(event,data,textStatus,jqXHR) {
            const target = trigHdlr(this,'enumSetInput:getTarget');
            const result = trigHdlr(this,'enumSetInput:getResult');
            result.html(data);
            target.trigger('clickOpen:ready');
        })
        .on('ajax:error',function(event,parsedError,jqXHR,textStatus,errorThrown) {
            trigHdlr(this,'enumSetInput:getResult').html(parsedError);
        })
        .on('ajax:complete',function() {
            trigHdlr(this,'enumSetInput:getParent').removeAttr('data-status');
            trigEvt(this,'unblock');
        })
        
        return this;
    };
    
    const $this = this;
    $(this).each(function(index, el) {
        const enumSet = $(this);
        
        // enumSet
        Component.clickOpenWithTrigger.call(this,"> .trigger");
        bindEnumSet.call(this);
        
        $(this).on('enumSet:getMode',function(event) {
            return $(this).parents(".form-element").data('mode');
        })
        .on('clickOpen:ready',function(event) {
            trigHdlr(this,'clickOpen:getTarget').trigger('feed:bind');
        }).on('clickOpen:getBackgroundFrom',function(event) {
            return 'enumSet';
        })
        
        // target
        const target = trigHdlr(this,'clickOpen:getTarget');
        Component.appendContainer.call(target);
        
        target.on('feed:target',function(event) {
            return $(this).find(".results ul:first-child");
        })
        .on('feed:loadMoreRemove',function(event,loadMore) {
            return loadMore.parent('li');
        })
        .on('feed:parseData',function(event,data) {
            return Html.parse(data).find("li");
        })
        .on('click', 'li > button',function(event) {
            enumSet.trigger('choice:append',[$(this).data('value'),$(this).data('html')]);
            event.stopPropagation();
        });
        
        // input
        const input = trigHdlr(this,'enumSet:getInput');
        bindEnumSetInput.call(input);
        trigHdlr(this,'enumSet:getOrder').on('change',function(event) {
            enumSet.trigHdlr('enumSet:getInput').trigger('ajax:beforeInit',[false]);
        });
        
        // button
        trigHdlr(this,'enumSet:getButton').on('click',function(event) {
            event.stopPropagation();
            input.val("");
            input.trigger('ajax:beforeInit');
        });
    });
    
    return this;
}