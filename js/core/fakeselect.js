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
quid.core.fakeselect = function()
{
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
    
    quid.core.clickOpenWithTrigger.call(this,"> .trigger");
    $(this).enterCatch(true)
    .on('enter:blocked', function(event) {
        $(this).trigger('clickOpen:toggle');
    })
    .on('fakeselect:getChoices', function(event) {
        return $(this).triggerHandler('clickOpen:getTarget').find("li > button");
    })
    .on('input:isFake', function(event) {
        return true;
    })
    .on('input:getValue', function(event) {
        return $(this).triggerHandler('fakeselect:getValue');
    })
    .on('fakeselect:getInput', function(event) {
        return $(this).find("input[type='hidden']");
    })
    .on('fakeselect:getSelected', function(event) {
        return $(this).find("li > button.selected");
    })
    .on('fakeselect:getValue', function(event) {
        return $(this).triggerHandler('fakeselect:getSelected').data('value');
    })
    .on('fakeselect:getTitle', function(event) {
        return $(this).triggerHandler('clickOpen:getTrigger').find(".title").first();
    })
    .on('fakeselect:setTitle', function(event,value) {
        event.stopPropagation();
        $(this).triggerHandler('fakeselect:getTitle').text(value);
    })
    .on('fakeselect:prepare', function(event) {
        var $this = $(this);
        var choices = $(this).triggerHandler('fakeselect:getChoices');
        var selected = $(this).triggerHandler('fakeselect:getSelected');
        
        choices.enterCatch(true).on('click enter:blocked', function(event) {
            event.stopPropagation();
            choose.call($this,$(this));
        });
        
        if(selected.length)
        choose.call(this,selected);
    })
    .on('clickOpen:getBackgroundFrom', function(event) {
        return 'fakeselect';
    })
    .trigger('fakeselect:prepare');
    
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
            var title = $(this).find("option:selected").text() || "&nbsp;";
            var options = $(this).find("option");
            var value = $(this).inputValue(true);
            var html = '';
            
            html += "<div tabindex='-1' class='fakeselect";
            html += "'";
            if(required)
            html += " data-required='1'";
            html += "><button type='button' class='trigger'>";
            html += "<span data-title'='"+title+"' class='title'>"+title+"</span>";
            html += "<span class='ico'></span>";
            html += "</button>";
            html += "<div class='popup'>";
            html += "<ul>";
            
            options.each(function(index, el) {
                var val = $(this).prop('value');
                var text = $(this).text() || "&nbsp;";
                html += "<li>";
                html += "<button type='button'";
                if(val != null)
                {
                    if(val === value)
                    html += " class='selected'";
                    
                    html += " data-value='"+val+"'";
                }
                
                html += ">";
                html += text+"</button>";
                html += "</li>";
            });
            
            html += "</ul>";
            html += "</div>";
            html += "<input name='"+name+"' type='hidden' data-fakeselect='1' value='"+value+"'/>";
            html += "</div>";

            $(this).after(html);
            
            var fakeselect = $(this).next('.fakeselect');
            quid.core.fakeselect.call(fakeselect);
            
            $(this).remove();
        }
    });
    
    return this;
}