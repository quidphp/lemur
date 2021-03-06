/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
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
            return qs(popup,'.scroller',true);
        },
        
        getCheckboxes: function() {
            return qsa(this,"input[type='checkbox']");
        },
        
        getCheckedCheckboxes: function() {
            return Arr.filter(trigHdlr(this,'colsSorter:getCheckboxes'),function(ele) {
                return Ele.match(ele,':checked');
            });
        },
        
        getButton: function() {
            const target = trigHdlr(this,'clickOpen:getTarget');
            return qs(target,"button[name='cols']",true);
        },
        
        getCheckedSet: function() {
            const button = trigHdlr(this,'colsSorter:getButton');
            const checkbox = trigHdlr(this,'colsSorter:getCheckedCheckboxes');
            const separator = getAttr(button,'data-separator');
            
            return Ele.propStr(checkbox,'value',separator);
        },
        
        hasChanged: function() {
            const button = trigHdlr(this,'colsSorter:getButton');
            const set = trigHdlr(this,'colsSorter:getCheckedSet');
            const current = getAttr(button,'data-current');
            
            return set !== current;
        }
    });
    
    
    // event
    ael(this,'clickOpen:closed',function() {
        if(trigHdlr(this,'colsSorter:hasChanged'))
        redirect.call(this);
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
                if(!trigHdlr($this,'colsSorter:hasChanged'))
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
        
        Component.HrefReplaceChar.call(button);
        
        // event
        ael(button,'click',function(event) {
            redirect.call($this,event);
        });
    }
    
    
    // redirect
    const redirect = function(clickEvent)
    {
        const button = trigHdlr(this,'colsSorter:getButton');
        const set = trigHdlr(this,'colsSorter:getCheckedSet');
        const href = trigHdlr(button,'hrefReplaceChar:make',set);
        
        if(Str.isNotEmpty(href) && href !== Request.relative())
        trigHdlr(document,'history:href',href,clickEvent);
    }

    return this;
}