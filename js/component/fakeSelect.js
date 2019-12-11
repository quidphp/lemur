/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// fakeSelect
// script with some logic for a select replacement component, uses clickOpen
const FakeSelect = Component.FakeSelect = function()
{
    const r = [];
    
    // htmlFromSelect
    const htmlFromSelect = function() 
    {
        let r = '';
        const name = $(this).prop('name');
        const required = $(this).data('required');
        const disabled = $(this).prop('disabled');
        const selected = qs(this,"option:selected");
        const selectedText = (selected != null)? $(selected).text():null;
        const title = (Str.isNotEmpty(selectedText))? selectedText:"&nbsp;";
        const options = qsa(this,'option');
        const value = trigHandler(this,'input:getValue');
        const datas = Dom.attrStr(this,'data-');
                
        r += "<div tabindex='-1' data-fake-input='1' data-anchor-corner='1' data-absolute-placeholder='1' class='fakeselect'";
        if(disabled)
        r += " data-disabled='1'";
        if(Str.isNotEmpty(datas))
        r += " "+datas;
        r += "><button type='button' class='trigger'>";
        r += "<span data-title'='"+title+"' class='title'>"+title+"</span>";
        r += "<span class='ico'></span>";
        r += "</button>";
        r += "<div class='popup'>";
        r += "<ul>";
        
        Arr.each(options,function() {
            const val = Str.cast($(this).prop('value'));
            const text = $(this).text() || "&nbsp;";
            const datas = Dom.attrStr(this,'data-');
            
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
        r += "</div>";
        
        return r;
    }
    
    
    // bindFakeSelect
    const bindFakeSelect = function() 
    {    
        // clickOpen
        Component.ClickOpenTrigger.call(this,{trigger: "> .trigger", target: "> .popup"});
        Component.KeyboardEnter.call(this,true);
        
        
        // handler
        setHandler(this,'fakeSelect:getSelect',function() {
            return $(this).prev("select").get(0);
        });
        
        setHandler(this,'fakeSelect:getChoices',function() {
            const target = trigHandler(this,'clickOpen:getTarget');
            return qsa(target,"li > button");
        });
        
        setHandler(this,'fakeSelect:getChoice',function(value) {
            return Arr.find(trigHandler(this,'fakeSelect:getChoices'),function() {
                return Str.isEqual($(this).data('value'),value);
            });
        });
        
        setHandler(this,'fakeSelect:getSelected',function() {
            return Arr.find(trigHandler(this,'fakeSelect:getChoices'),function() {
                return $(this).hasClass('selected');
            });
        });
        
        setHandler(this,'fakeSelect:getTitle',function() {
            const trigger = trigHandler(this,'clickOpen:getTrigger');
            return qs(trigger,".title");
        });
        
        setHandler(this,'fakeSelect:setTitle',function(value) {
            const title = trigHandler(this,'fakeSelect:getTitle');
            $(title).text(value);
        });
        
        setHandler(this,'clickOpen:getBackgroundFrom',function() {
            return 'fakeselect';
        });
        
        
        // event
        ael(this,'keyboardEnter:blocked',function() {
            trigEvt(this,'clickOpen:toggle');
        });
        
        
        // setup
        aelOnce(this,'component:setup',function() {
            bindTrigger.call(this);
            bindSelect.call(this);
            bindChoices.call(this);
        });
        
        
        // bindTrigger
        const bindTrigger = function() 
        {
            const trigger = trigHandler(this,'clickOpen:getTrigger');
            const select = trigHandler(this,'fakeSelect:getSelect');
            
            ael(trigger,'click',function() {
                trigEvt(select,'validate:valid');
            });
        }
        
        
        // bindSelect
        const bindSelect = function() 
        {
            const $this = this;
            const select = trigHandler(this,'fakeSelect:getSelect');
            
            ael(select,'change',function() {
                const value = trigHandler(this,'input:getValue');
                const choice = trigHandler($this,'fakeSelect:getChoice',value);
                
                if(choice != null)
                choose.call($this,choice);
            });
            
            ael(select,'input:disable',function() {
                $($this).attr('data-disabled',1);
            });
            
            ael(select,'input:enable',function() {
                $($this).removeAttr('data-disabled');
            });
            
            ael(select,'validate:valid',function() {
                $($this).attr('data-validate','valid');
            });
            
            ael(select,'validate:invalid',function() {
                $($this).attr('data-validate','invalid');
            });
        }
        
        
        // bindChoices
        const bindChoices = function() 
        {
            const $this = this;
            const choices = trigHandler(this,'fakeSelect:getChoices');
            const selected = trigHandler(this,'fakeSelect:getSelected');
            
            Component.KeyboardEnter.call(choices,true);
            
            ael(choices,'click',function() {
                choose.call($this,this);
                event.stopPropagation();
            });
            
            ael(choices,'keyboardEnter:blocked',function() {
                choose.call($this,this);
            });
            
            if(selected != null)
            choose.call(this,selected);
        }
        
        
        // choose
        const choose = function(selected)
        {
            const value = $(selected).data("value");
            const text = $(selected).text();
            const select = trigHandler(this,'fakeSelect:getSelect');
            const choices = trigHandler(this,'fakeSelect:getChoices');
            const current = trigHandler(select,'input:getValue');
            
            $(choices).removeClass('selected');
            $(selected).addClass('selected');
            
            trigHandler(select,'input:setValue',value);
            trigHandler(this,'fakeSelect:setTitle',text);
            trigHandler(this,'absolutePlaceholder:refresh');
            trigEvt(this,'clickOpen:close');
            
            if(!Str.isEqual(value,current))
            trigEvt(select,'change');
        }
    }
    
    
    // htmlFromSelect
    $(this).each(function() {
        if(trigHandler(this,'input:getTag') === 'select')
        {
            if(trigHandler(this,'input:allowMultiple') === false && trigHandler(this,'input:isControlled') === false)
            {
                const html = htmlFromSelect.call(this);
                const node = $(html).insertAfter(this).get(0);
                bindFakeSelect.call(node);
                $(this).attr('data-controlled',1);
                r.push(node);
            }
        }
    });

    return r;
}