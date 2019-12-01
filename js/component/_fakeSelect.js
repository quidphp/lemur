/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// fakeSelect
// script with some logic for a select replacement component, uses clickOpen
Component.fakeSelect = function()
{
    // alias
    const setFunc = Evt.setFunc;
    const triggerFunc = Evt.triggerFunc;
    
    // htmlFromSelect
    const htmlFromSelect = function() {
        let r = '';
        const name = $(this).prop('name');
        let required = $(this).data('required');
        const disabled = $(this).prop('disabled');
        const title = $(this).find("option:selected").text() || "&nbsp;";
        const options = $(this).find("option");
        const value = triggerFunc(this,'input:getValue');
        const datas = Dom.getAttrStr(this,'data-');
        
        const inputHtml = "<input name='"+name+"' type='hidden' data-fakeselect='1' value='"+value+"'";
        if(required)
        inputHtml += " data-required='1'"
        if(disabled)
        inputHtml += " disabled";
        inputHtml += "/>";
        
        r += "<div tabindex='-1' data-fake-input='1' class='fakeselect'";
        if(Str.isNotEmpty(datas))
        r += " "+datas;
        r += "><button type='button' class='trigger'>";
        r += "<span data-title'='"+title+"' class='title'>"+title+"</span>";
        r += "<span class='ico'></span>";
        r += "</button>";
        r += "<div class='popup'>";
        r += "<ul>";
        
        options.each(function(index, el) {
            const val = Str.cast($(this).prop('value'));
            const text = $(this).text() || "&nbsp;";
            const datas = Dom.getAttrStr(this,'data-');
            
            r += "<li>";
            r += "<button type='button'";
            if(val != null)
            {
                if(val === value)
                r += " class='selected'";
                
                r += " data-value='"+val+"'";
                
                if(Str.isNotEmpty(datas))
                r += ' '.Obj.str(datas,'=',true);
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
    const bindFakeSelect = function() {
        
        // clickOpen
        Component.clickOpenWithTrigger.call(this,"> .trigger");
        Component.keyboardEnter.call(this,true);
        
        // triggerHandler
        $(this).on('fakeselect:getChoices', function() {
            return triggerFunc(this,'clickOpen:getTarget').find("li > button");
        })
        .on('fakeselect:getValue', function() {
            return triggerFunc(this,'fakeselect:getSelected').data('value');
        })
        .on('fakeselect:getInput', function() {
            return $(this).find("input[type='hidden']");
        })
        .on('fakeselect:getSelected', function() {
            return $(this).find("li > button.selected");
        })
        .on('fakeselect:getTitle', function() {
            return triggerFunc(this,'clickOpen:getTrigger').find(".title").first();
        })
        .on('clickOpen:getBackgroundFrom', function() {
            return 'fakeselect';
        })
        
        // trigger
        .on('enter:blocked', function() {
            triggerCustom(this,'clickOpen:toggle');
        })
        .on('fakeselect:setTitle', function(event,value) {
            triggerFunc(this,'fakeselect:getTitle').text(value);
            event.stopPropagation();
        })
        .on('fakeselect:disable',function() {
            const input = triggerFunc(this,'fakeselect:getInput');
            input.trigger('input:disable');
        })
        .on('fakeselect:enable',function() {
            const input = triggerFunc(this,'fakeselect:getInput');
            input.trigger('input:disable');
        })
        
        // setup
        .one('component:setup', function() {
            bindTrigger.call(this);
            bindInput.call(this);
            bindChoices.call(this);
        });
        
        // bindTrigger
        const bindTrigger = function() {
            const trigger = triggerFunc(this,'clickOpen:getTrigger');
            const input = triggerFunc(this,'fakeselect:getInput');
            
            trigger.on('click', function() {
                input.trigger('validate:valid');
            });
        };
        
        // bindInput
        const bindInput = function() {
            const $this = $(this);
            const input = triggerFunc(this,'fakeselect:getInput');
            
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
        const bindChoices = function() {
            const $this = $(this);
            const choices = triggerFunc(this,'fakeselect:getChoices');
            const selected = triggerFunc(this,'fakeselect:getSelected');
            
            Component.keyboardEnter.call(choices,true);
            
            choices.on('click enter:blocked', function(event) {
                choose.call($this,$(this));
                event.stopPropagation();
            });
            
            if(selected.length)
            choose.call(this,selected);
        };
        
        // choose
        const choose = function(selected)
        {
            const input = triggerFunc(this,'fakeselect:getInput');
            const choices = triggerFunc(this,'fakeselect:getChoices');
            const value = selected.data("value");
            const current = input.triggerHandler('input:getValue');
            choices.removeClass('selected');
            selected.addClass('selected');
            input.val(value);
            
            triggerCustom(this,'fakeselect:setTitle',selected.text());
            triggerCustom(this,'clickOpen:close');
            
            if(Str.cast(value) !== Str.cast(current))
            {
                triggerCustom(this,'fakeselect:changed',[value,selected]);
                triggerCustom(this,'change');
                input.trigger('change');
            }
        }
    }
    
    let r = $();
    
    // htmlFromSelect
    $(this).each(function(index, el) {
        if(Dom.tag(this) === 'select')
        {
            const html = htmlFromSelect.call(this);
            const node = $(html);
            const input = node.find("input");

            $(this).replaceWith(node);
            Component.input.call(input);
            r = r.add(node);
        }
        
        else
        r = r.add(this);
    });
    
    // bindFakeSelect
    bindFakeSelect.call(r);
    
    return r;
}