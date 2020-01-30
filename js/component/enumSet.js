/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// enumSet
// script for an enumSet component (search in a relation)
Component.EnumSet = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        trigger: ".input button",
        target: ".popup",
        search: ".input input[type='text']",
        closeUnsetContent: true,
        inputSearch: {
            useCurrent: false,
            button: null
        },
        sorter: {
            draggable: ".choice", 
            handle: '.choice-in'
        }
    },option);
    
    
    // components
    Component.FeedSearch.call(this,$option);
    Component.ClickOpenTrigger.call(this,$option);
    
    
    // handler
    setHdlrs(this,'enumSet:',{
        
        getCurrent: function() {
            return qs(this,'.current');
        },
        
        getChoices: function() {
            const current = trigHdlr(this,'enumSet:getCurrent');
            return qsa(current,'.choice');
        },
        
        getChoicesCount: function() {
            return Arr.length(trigHdlr(this,'enumSet:getChoices'));
        },
        
        getRadioCheckbox: function() {
            const choices = trigHdlr(this,'enumSet:getChoices');
            return Nod.mergedQsa(choices,"input[type='checkbox'],input[type='radio']");
        },
        
        getCheckedSet: function() {
            const searchNode = trigHdlr(this,'feedSearch:getSearch');
            const separator = getAttr(searchNode,'data-separator');
            const radioCheckbox = trigHdlr(this,'enumSet:getRadioCheckbox');
            return Ele.propStr(radioCheckbox,'value',separator);
        },
        
        getMode: function() {
            const searchNode = trigHdlr(this,'feedSearch:getSearch');
            return getAttr(searchNode,'data-mode');
        },
        
        isEnum: function() {
            return trigHdlr(this,'enumSet:getMode') === 'enum';
        },
        
        isSet: function() {
            return trigHdlr(this,'enumSet:getMode') === 'set';
        },
        
        isChoiceIn: function(value) {
            const radioCheckbox = trigHdlr(this,'enumSet:getRadioCheckbox');
            const find = Arr.find(radioCheckbox,function() {
                return Nod.match(this,"[value='"+value+"']")
            });
            
            return find != null;
        },
        
        emptyChoice: function() {
            const choices = trigHdlr(this,'enumSet:getChoices');
            Ele.remove(choices);
        },
        
        findResult: function(value) {
            if(Ele.is(value))
            value = getAttr(value,'data-value');
            
            const result = trigHdlr(this,'feedSearch:getResult');
            return qs(result,"li > button[data-value='"+value+"']");
        }
    });
    
    setHdlr(this,'ajaxBlock:getContentNode',function() {
        return trigHdlr(this,'feedSearch:getResult');
    });
    
    setHdlr(this,'clickOpen:getTargetFocus',function() {
        return trigHdlr(this,'feedSearch:getSearch') || trigHdlr(this,'clickOpen:getTarget');
    });
    
    setHdlr(this,'clickOpen:getTargetContent',function() {
        return trigHdlr(this,'feedSearch:getResult');
    });
    
    setHdlr(this,'ajax:config',function() {
        const searchNode = trigHdlr(this,'feedSearch:getSearch');
        const separator = getAttr(searchNode,'data-separator');
        const query = getAttr(searchNode,'data-query');
        const searchValue = trigHdlr(this,'feedSearch:getSearchValue');
        const order = trigHdlr(this,'feedSearch:getOrderValue') || separator;
        const selected = trigHdlr(this,'enumSet:getCheckedSet') || separator;
        const uri = trigHdlr(searchNode,'hrefReplaceChar:make',selected,order);
        const data = {};
        data[query] = searchValue;
        
        return {
            url: uri,
            data: data
        }
    });
    
    
    // event
    ael(this,'ajaxBlock:before',function() {
        trigEvt(this,'clickOpen:open');
    });
    
    ael(this,'clickOpen:triggerClick',function() {
        trigHdlr(this,'ajax:init');
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindResults.call(this);
        bindChoices.call(this);
        bindSearch.call(this);
    });
    
    
    // bindResults
    const bindResults = function()
    {
        const $this = this;
        const results = trigHdlr(this,'feedSearch:getResult');
        
        aelDelegate(results,'click', 'li > button',function() {
            addChoice.call($this,getAttr(this,'data-value'),getAttr(this,'data-html'));
        });
    }
    
    
    // bindChoices
    const bindChoices = function()
    {
        const current = trigHdlr(this,'enumSet:getCurrent');
        
        // enum
        if(trigHdlr(this,'enumSet:isEnum'))
        {
            // delegate
            aelDelegate(current,'click', "input[type='radio']",function(event) {
                setProp(this,'checked',false);
                const parent = Nod.closest(this,".choice");
                Ele.remove(parent);
            });
        }
        
        // set
        else if(trigHdlr(this,'enumSet:isSet'))
        {
            trigSetup(Component.Sorter.call(current,$option.sorter));
            
            aelDelegate(current,'change', "input[type='checkbox']",function(event) {
                if(Nod.match(this,":checked") === false)
                {
                    const parent = Nod.closest(this,".choice");
                    Ele.remove(parent);
                }
            });
        }
    }
    
    
    // bindSearch
    const bindSearch = function()
    {
        const searchNode = trigHdlr(this,'feedSearch:getSearch');
        Component.HrefReplaceChar.call(searchNode);
    }
    
    
    // addChoice
    const addChoice = function(value,html)
    {
        const mode = trigHdlr(this,'enumSet:getMode');
        const current = trigHdlr(this,'enumSet:getCurrent');
        
        if(Str.isNotEmpty(html) && Scalar.is(value) && Str.isNotEmpty(mode))
        {
            const button = trigHdlr(this,'enumSet:findResult',value);
            
            if(trigHdlr(this,'enumSet:isChoiceIn',value))
            setAttr(button,'data-in',1);
            
            else
            {
                if(trigHdlr(this,'enumSet:isEnum'))
                trigHdlr(this,'enumSet:emptyChoice');
                
                else if(trigHdlr(this,'enumSet:isSet'))
                setAttr(button,'data-in',0);
                
                Ele.append(current,html);
                
                const radioCheckbox = trigHdlr(this,'enumSet:getRadioCheckbox');
                Ele.each(radioCheckbox,function() {
                    if(!trigHdlr(this,'input:isBinded'))
                    Component.Input.call(this);
                });
                
                trigEvt(this,'clickOpen:close');
            }
        }
    }
    
    return this;
}