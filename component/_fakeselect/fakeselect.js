"use strict";

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// fakeselect
// script with some logic for a select replacement component

// fakeselect
// crée les comportements pour un input fakeSelect, pouvant avoir un inputHidden lié
// fakeselect étend clickOpen
quid.component.fakeselect = function()
{
    // clickOpen
    quid.core.clickOpenWithTrigger.call(this,"> .trigger");
    quid.main.keyboard.enter.call(this,true);
    
    // triggerHandler
    $(this).on('fakeselect:getChoices', function(event) {
        return $(this).triggerHandler('clickOpen:getTarget').find("li > button");
    })
    .on('fakeselect:getValue', function(event) {
        return $(this).triggerHandler('fakeselect:getSelected').data('value');
    })
    .on('fakeselect:getInput', function(event) {
        return $(this).find("input[type='hidden']");
    })
    .on('fakeselect:getSelected', function(event) {
        return $(this).find("li > button.selected");
    })
    .on('fakeselect:getTitle', function(event) {
        return $(this).triggerHandler('clickOpen:getTrigger').find(".title").first();
    })
    .on('clickOpen:getBackgroundFrom', function(event) {
        return 'fakeselect';
    })
    
    // trigger
    .on('enter:blocked', function(event) {
        $(this).trigger('clickOpen:toggle');
    })
    .on('fakeselect:setTitle', function(event,value) {
        event.stopPropagation();
        $(this).triggerHandler('fakeselect:getTitle').text(value);
    })
    .on('fakeselect:disable',function(event) {
        var input = $(this).triggerHandler('fakeselect:getInput');
        input.trigger('input:disable');
    })
    .on('fakeselect:enable',function(event) {
        var input = $(this).triggerHandler('fakeselect:getInput');
        input.trigger('input:disable');
    })
    .one('component:setup', function(event) {
        var $this = $(this);
        var trigger = $(this).triggerHandler('clickOpen:getTrigger');
        var input = $(this).triggerHandler('fakeselect:getInput');
        var choices = $(this).triggerHandler('fakeselect:getChoices');
        var selected = $(this).triggerHandler('fakeselect:getSelected');
        
        trigger.on('click', function(event) {
            input.trigger('validate:valid');
        });
        
        input.on('input:disable', function(event) {
            $this.attr('data-disabled',1);
        })
        .on('input:enable', function(event) {
            $this.removeAttr('data-disabled');
        })
        .on('validate:valid', function(event) {
            $this.attr('data-validate','valid');
        })
        .on('validate:invalid', function(event) {
            $this.attr('data-validate','invalid');
        })
        .trigger('input:prepareDisable');
        
        choices.enterCatch(true).on('click enter:blocked', function(event) {
            event.stopPropagation();
            choose.call($this,$(this));
        });
        
        if(selected.length)
        choose.call(this,selected);
    });
    
    // choose
    function choose(selected)
    {
        var input = $(this).triggerHandler('fakeselect:getInput');
        var choices = $(this).triggerHandler('fakeselect:getChoices');
        var value = selected.data("value");
        var current = input.inputValue(true);
        choices.removeClass('selected');
        selected.addClass('selected');
        input.val(value);
        
        $(this).trigger('fakeselect:setTitle',selected.text());
        $(this).trigger('clickOpen:close');
        
        if(String(value) !== String(current))
        {
            $(this).trigger('fakeselect:changed',[value,selected]);
            $(this).trigger('change');
            input.trigger('change');
        }
    }
    
    // trigger bind
    $(this).trigger('component:setup');
    
    return this;
}


// selectToFake
// transforme des tags select en fakeselect
quid.core.selectToFake = function()
{
    $(this).each(function(index, el) {
        if($(this).tagName() === 'select')
        {
            var name = $(this).prop('name');
            var required = $(this).data('required');
            var disabled = $(this).prop('disabled');
            var title = $(this).find("option:selected").text() || "&nbsp;";
            var options = $(this).find("option");
            var value = $(this).inputValue(true);
            var datas = $(this).getDataAttributes();
            var html = '';
            
            var inputHtml = "<input name='"+name+"' type='hidden' data-fakeselect='1' value='"+value+"'";
            if(required)
            inputHtml += " data-required='1'"
            if(disabled)
            inputHtml += " disabled";
            inputHtml += "/>";
            
            html += "<div tabindex='-1' data-fake-input='1' class='fakeselect";
            html += "'";
            if(!quid.base.obj.isEmpty(datas))
            html += quid.main.attr.str(datas);
            html += "><button type='button' class='trigger'>";
            html += "<span data-title'='"+title+"' class='title'>"+title+"</span>";
            html += "<span class='ico'></span>";
            html += "</button>";
            html += "<div class='popup'>";
            html += "<ul>";
            
            options.each(function(index, el) {
                var val = String($(this).prop('value'));
                var text = $(this).text() || "&nbsp;";
                var datas = $(this).getDataAttributes();
                
                html += "<li>";
                html += "<button type='button'";
                if(val != null)
                {
                    if(val === value)
                    html += " class='selected'";
                    
                    html += " data-value='"+val+"'";
                    
                    if(!quid.base.obj.isEmpty(datas))
                    html += quid.main.attr.str(datas);
                }
                
                html += ">";
                html += text+"</button>";
                html += "</li>";
            });
            
            html += "</ul>";
            html += "</div>";
            html += inputHtml;
            html += "</div>";

            $(this).after(html);
            
            var fakeselect = $(this).next('.fakeselect');
            quid.component.fakeselect.call(fakeselect);
            
            $(this).remove();
        }
    });
    
    return this;
}