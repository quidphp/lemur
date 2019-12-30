/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

// colsSorter
// script for the col sorter component of the general page of the CMS
Component.ColsSorter = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replaceRecursive({
        clickOpen: {
            trigger: ".trigger",
            target: ".popup"
        },
        sorter: {
            draggable: ".choice",
            handle: '.choice-in'
        }
    },option);
    
    
    // component
    Component.ClickOpenTrigger.call(this,$option.clickOpen);
    
    
    // handler
    setHdlrs(this,'colsSorter:',{
        
        getScroller: function() {
            const popup = trigHdlr(this,'clickOpen:getTarget');
            return qs(popup,'.scroller');
        },
        
        getCheckboxes: function() {
            return qsa(this,"input[type='checkbox']");
        },
        
        getCheckedCheckboxes: function() {
            return Arr.filter(trigHdlr(this,'colsSorter:getCheckboxes'),function() {
                return Nod.match(this,':checked');
            });
        },
        
        getButton: function() {
            return qs(trigHdlr(this,'clickOpen:getTarget'),"button[name='cols']");
        },
        
        getCheckedSet: function() {
            const button = trigHdlr(this,'colsSorter:getButton');
            const checkbox = trigHdlr(this,'colsSorter:getCheckedCheckboxes');
            const separator = getAttr(button,'data-separator');
            
            return EleHelper.valueSeparator(checkbox,separator,true);
        },
        
        isCurrent: function() {
            const button = trigHdlr(this,'colsSorter:getButton');
            const set = trigHdlr(this,'colsSorter:getCheckedSet');
            const current = getAttr(button,'data-current');
            
            return (set === current)? true:false;
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindColsPopup.call(this);
        bindColsCheckboxes.call(this);
        bindColsButton.call(this);
    });
    
    
    // bindColsPopup
    const bindColsPopup = function() 
    {
        const $this = this;
        const popup = trigHdlr(this,'clickOpen:getTarget');
        const scroller = trigHdlr(this,'colsSorter:getScroller');
        
        // scroller
        trigSetup(Component.Sorter.call(scroller,$option.sorter));
        setHdlr(scroller,'sorter:end',function() {
            trigHdlr(popup,'popup:refresh');
        });
        
        // popup
        setHdlrs(popup,'popup:',{
            
            refresh: function() {
                const checkboxes = trigHdlr($this,'colsSorter:getCheckboxes');
                trigHdlrs(checkboxes,'validate:trigger');
            },
            
            invalid: function() {
                setAttr(this,'data-validate','invalid');
            },
            
            valid: function() {
                if(trigHdlr($this,'colsSorter:isCurrent'))
                Ele.removeAttr(this,"data-validate");
                else
                setAttr(this,'data-validate','valid');
            }
        });
    }
    
    
    // bindColsCheckboxes
    const bindColsCheckboxes = function() 
    {
        const checkboxes = trigHdlr(this,'colsSorter:getCheckboxes');
        const popup = trigHdlr(this,'clickOpen:getTarget');
        
        trigSetup(checkboxes);
        
        ael(checkboxes,'validate:invalid',function() {
            trigHdlr(popup,'popup:invalid');
        });
        
        ael(checkboxes,'validate:valid',function() {
            trigHdlr(popup,'popup:valid');
        });
    }
    
    
    // bindColsButton
    const bindColsButton = function() 
    {
        const $this = this;
        const button = trigHdlr(this,'colsSorter:getButton');
        
        // handler
        setHdlr(button,'button:redirect',function(clickEvent) {
            const set = trigHdlr($this,'colsSorter:getCheckedSet');
            const href = EleHelper.dataHrefReplaceChar(this,set);
            
            if(Str.isNotEmpty(href) && href !== Request.relative())
            trigHdlr(document,'history:href',href,clickEvent);
        });
        
        // event
        ael(button,'click',function(event) {
            trigHdlr(this,'button:redirect',event);
        });
    }

    return this;
}