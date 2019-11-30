/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// fakeSelect
// script with some logic for a select replacement component, uses clickOpen
Quid.Component.fakeSelect = function()
{
    // alias
    var setFunc = Quid.Event.setFunc;
    var triggerFunc = Quid.Event.triggerFunc;
    
    // htmlFromSelect
    var htmlFromSelect = function() {
        var r = '';
        var name = $(this).prop('name');
        var required = $(this).data('required');
        var disabled = $(this).prop('disabled');
        var title = $(this).find("option:selected").text() || "&nbsp;";
        var options = $(this).find("option");
        var value = triggerFunc(this,'input:getValue');
        var datas = Quid.Node.getAttrStr(this,'data-');
        
        var inputHtml = "<input name='"+name+"' type='hidden' data-fakeselect='1' value='"+value+"'";
        if(required)
        inputHtml += " data-required='1'"
        if(disabled)
        inputHtml += " disabled";
        inputHtml += "/>";
        
        r += "<div tabindex='-1' data-fake-input='1' class='fakeselect'";
        if(Quid.Str.isNotEmpty(datas))
        r += " "+datas;
        r += "><button type='button' class='trigger'>";
        r += "<span data-title'='"+title+"' class='title'>"+title+"</span>";
        r += "<span class='ico'></span>";
        r += "</button>";
        r += "<div class='popup'>";
        r += "<ul>";
        
        options.each(function(index, el) {
            var val = Quid.Str.cast($(this).prop('value'));
            var text = $(this).text() || "&nbsp;";
            var datas = Quid.Node.getAttrStr(this,'data-');
            
            r += "<li>";
            r += "<button type='button'";
            if(val != null)
            {
                if(val === value)
                r += " class='selected'";
                
                r += " data-value='"+val+"'";
                
                if(Quid.Str.isNotEmpty(datas))
                r += ' '.Quid.Obj.str(datas,'=',true);
            }
            
            r += ">";
            r += text+"</button>";
            r += "</li>";
        });
        
        r += "</ul>";
        r += "</div>";
        r += inputHtml;
        r += "</div>";
        
        return r;
    };
    
    // bindFakeSelect
    var bindFakeSelect = function() {
        
        // clickOpen
        Quid.Component.clickOpenWithTrigger.call(this,"> .trigger");
        Quid.Component.keyboardEnter.call(this,true);
        
        // triggerHandler
        $(this).on('fakeselect:getChoices', function() {
            return $(this).triggerHandler('clickOpen:getTarget').find("li > button");
        })
        .on('fakeselect:getValue', function() {
            return $(this).triggerHandler('fakeselect:getSelected').data('value');
        })
        .on('fakeselect:getInput', function() {
            return $(this).find("input[type='hidden']");
        })
        .on('fakeselect:getSelected', function() {
            return $(this).find("li > button.selected");
        })
        .on('fakeselect:getTitle', function() {
            return $(this).triggerHandler('clickOpen:getTrigger').find(".title").first();
        })
        .on('clickOpen:getBackgroundFrom', function() {
            return 'fakeselect';
        })
        
        // trigger
        .on('enter:blocked', function() {
            $(this).trigger('clickOpen:toggle');
        })
        .on('fakeselect:setTitle', function(event,value) {
            $(this).triggerHandler('fakeselect:getTitle').text(value);
            event.stopPropagation();
        })
        .on('fakeselect:disable',function() {
            var input = $(this).triggerHandler('fakeselect:getInput');
            input.trigger('input:disable');
        })
        .on('fakeselect:enable',function() {
            var input = $(this).triggerHandler('fakeselect:getInput');
            input.trigger('input:disable');
        })
        
        // setup
        .one('component:setup', function() {
            bindTrigger.call(this);
            bindInput.call(this);
            bindChoices.call(this);
        });
        
        // bindTrigger
        var bindTrigger = function() {
            var trigger = $(this).triggerHandler('clickOpen:getTrigger');
            var input = $(this).triggerHandler('fakeselect:getInput');
            
            trigger.on('click', function() {
                input.trigger('validate:valid');
            });
        };
        
        // bindInput
        var bindInput = function() {
            var $this = $(this);
            var input = $(this).triggerHandler('fakeselect:getInput');
            
            input.on('input:disable', function() {
                $this.attr('data-disabled',1);
            })
            .on('input:enable', function() {
                $this.removeAttr('data-disabled');
            })
            .on('validate:valid', function() {
                $this.attr('data-validate','valid');
            })
            .on('validate:invalid', function() {
                $this.attr('data-validate','invalid');
            })
            .trigger('input:prepareDisable');
        };
        
        // bindChoices
        var bindChoices = function() {
            var $this = $(this);
            var choices = $(this).triggerHandler('fakeselect:getChoices');
            var selected = $(this).triggerHandler('fakeselect:getSelected');
            
            Quid.Component.keyboardEnter.call(choices,true);
            
            choices.on('click enter:blocked', function(event) {
                choose.call($this,$(this));
                event.stopPropagation();
            });
            
            if(selected.length)
            choose.call(this,selected);
        };
        
        // choose
        var choose = function(selected)
        {
            var input = $(this).triggerHandler('fakeselect:getInput');
            var choices = $(this).triggerHandler('fakeselect:getChoices');
            var value = selected.data("value");
            var current = input.triggerHandler('input:getValue');
            choices.removeClass('selected');
            selected.addClass('selected');
            input.val(value);
            
            $(this).trigger('fakeselect:setTitle',selected.text());
            $(this).trigger('clickOpen:close');
            
            if(Quid.Str.cast(value) !== Quid.Str.cast(current))
            {
                $(this).trigger('fakeselect:changed',[value,selected]);
                $(this).trigger('change');
                input.trigger('change');
            }
        }
    }
    
    var r = $();
    
    // htmlFromSelect
    $(this).each(function(index, el) {
        if(Quid.Node.tag(this) === 'select')
        {
            var html = htmlFromSelect.call(this);
            var node = $(html);
            var input = node.find("input");

            $(this).replaceWith(node);
            Quid.Component.input.call(input);
            r = r.add(node);
        }
        
        else
        r = r.add(this);
    });
    
    // bindFakeSelect
    bindFakeSelect.call(r);
    
    return r;
}