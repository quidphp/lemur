/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// fakeSelect
// script with some logic for a select replacement component, uses clickOpen
Component.FakeSelect = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    const r = [];
    
    // htmlFromSelect
    const htmlFromSelect = function() 
    {
        let r = '';
        const name = getProp(this,'name');
        const required = getAttr(this,'data-required');
        const disabled = getProp(this,'disabled');
        const selected = qs(this,"option:checked");
        const selectedText = (selected != null)? Ele.getText(selected):null;
        const title = (Str.isNotEmpty(selectedText))? selectedText:"&nbsp;";
        const options = qsa(this,'option');
        const value = trigHdlr(this,'input:getValue');
        const datas = Ele.attrStr(this,'data-');
                
        r += "<div data-fake-input='1' data-anchor-corner='1' data-absolute-placeholder='1' class='fakeselect'";
        if(disabled)
        r += " data-disabled='1'";
        if(Str.isNotEmpty(datas))
        r += " "+datas;
        r += "><button type='button' class='trigger'>";
        r += "<span data-title'='"+title+"' class='title'>"+title+"</span>";
        r += "<span class='ico'></span>";
        r += "</button>";
        r += "<div class='popup' tabindex='0'>";
        r += "<ul>";
        
        Arr.each(options,function() {
            const val = Str.cast(getProp(this,'value'));
            const text = Ele.getText(this) || "&nbsp;";
            const datas = Ele.attrStr(this,'data-');
            
            r += "<li>";
            r += "<button type='button'";
            if(val != null)
            {
                if(val === value)
                r += " data-selected='1'";
                
                r += " data-value='"+val+"'";
                
                if(Str.isNotEmpty(datas))
                r += ' '+Obj.str(datas,'=',true);
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
        Component.ClickOpenTrigger.call(this,{trigger: "> .trigger", target: "> .popup", background: "fakeselect"});
        Component.Focusable.call(this,{target: "> .popup button"});
        Component.KeyboardEnter.call(this,true);
        Component.KeyboardArrow.call(this,true);
        
        
        // handler
        setHdlrs(this,'fakeSelect:',{
            
            getSelect: function() {
                return Nod.prev(this,'select');
            },
            
            getChoices: function() {
                const target = trigHdlr(this,'clickOpen:getTarget');
                return qsa(target,"li > button");
            },
            
            getChoice: function(value) {
                return Arr.find(trigHdlr(this,'fakeSelect:getChoices'),function() {
                    return Str.isEqual(getAttr(this,'data-value'),value);
                });
            },
            
            getSelected: function() {
                return Arr.find(trigHdlr(this,'fakeSelect:getChoices'),function() {
                    return (getAttr(this,'data-selected','int') === 1);
                });
            },
            
            getTitle: function() {
                const trigger = trigHdlr(this,'clickOpen:getTrigger');
                return qs(trigger,".title");
            },
            
            setTitle: function(value) {
                const title = trigHdlr(this,'fakeSelect:getTitle');
                EleChange.setText(title,value);
            }
        });
        
        
        // event
        ael(this,'keyboardEnter:blocked',function() {
            trigHdlr(this,'clickOpen:toggle');
        });
        
        ael(this,'keyboardArrow:up',function() {
            trigHdlr(this,'focusable:prev');
        });
        
        ael(this,'keyboardArrow:down',function() {
            trigHdlr(this,'focusable:next');
        });
        
        ael(this,'clickOpen:opened',function() {
            const selected = trigHdlr(this,'fakeSelect:getSelected');
            if(selected != null)
            Ele.focus(selected);
        });
        
        ael(this,'clickOpen:closed',function() {
            trigHdlr(this,'absolutePlaceholder:refresh');
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
            const trigger = trigHdlr(this,'clickOpen:getTrigger');
            const select = trigHdlr(this,'fakeSelect:getSelect');
            
            ael(trigger,'click',function() {
                trigEvt(select,'validate:valid');
            });
        }
        
        
        // bindSelect
        const bindSelect = function() 
        {
            const $this = this;
            const select = trigHdlr(this,'fakeSelect:getSelect');
            
            ael(select,'change',function() {
                const value = trigHdlr(this,'input:getValue');
                const choice = trigHdlr($this,'fakeSelect:getChoice',value);
                
                if(choice != null)
                choose.call($this,choice);
            });
            
            ael(select,'input:disable',function() {
                trigHdlr($this,'clickOpen:disable');
            });
            
            ael(select,'input:enable',function() {
                trigHdlr($this,'clickOpen:enable');
            });
            
            ael(select,'validate:valid',function() {
                setAttr($this,'data-validate','valid');
            });
            
            ael(select,'validate:invalid',function() {
                setAttr($this,'data-validate','invalid');
            });
        }
        
        
        // bindChoices
        const bindChoices = function() 
        {
            const $this = this;
            const choices = trigHdlr(this,'fakeSelect:getChoices');
            const selected = trigHdlr(this,'fakeSelect:getSelected');
            
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
            const value = getAttr(selected,'data-value');
            const text = Ele.getText(selected);
            const select = trigHdlr(this,'fakeSelect:getSelect');
            const choices = trigHdlr(this,'fakeSelect:getChoices');
            const current = trigHdlr(select,'input:getValue');
            
            EleChange.removeAttr(choices,'data-selected');
            setAttr(selected,'data-selected',1);
            
            trigHdlr(select,'input:setValue',value);
            trigHdlr(this,'fakeSelect:setTitle',text);
            trigHdlr(this,'absolutePlaceholder:refresh');
            trigEvt(this,'clickOpen:close');
            
            if(!Str.isEqual(value,current))
            trigBubble(select,'change');
        }
    }
    
    
    // htmlFromSelect
    Ele.each(this,function() {
        if(trigHdlr(this,'input:getTag') === 'select')
        {
            if(trigHdlr(this,'input:allowMultiple') === false && trigHdlr(this,'input:isControlled') === false)
            {
                const html = htmlFromSelect.call(this);
                const node = EleChange.insertAfter(this,html);
                bindFakeSelect.call(node);
                setAttr(this,'data-controlled',1);
                r.push(node);
            }
        }
    });

    return r;
}