/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// specificMulti
// component that manages the multi modification form
Component.SpecificMulti = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        formElement: ".form-element",
        specificComponent: ".form-element .specific-component"
    },option);
    
    
    // handler
    setHdlr(this,'specificMulti:getFormElements',function() {
        return qsa(this,$option.formElement);
    });
    
    setHdlr(this,'specificMulti:getComponents',function() {
        return qsa(this,$option.specificComponent);
    });
    
    
    // setup
    ael(this,'component:setup',function() {
        bindDocument.call(this);
        bindElements.call(this);
        trigEvt(this,'form:prepare');
    });
    
    
    // bindDocument
    const bindDocument = function()
    {
        const $this = this;
        
        const handler = ael(document,'specificForm:bindView',function(event,node) {
            const elements = qsa(node,$option.formElement);
            trigHdlrs(elements,'specificMulti:refresh');
        });
        
        aelOnce(document,'route:specificMulti:unmount',function() {
            rel(document,handler);
        })
    }
    
    
    // bindElements
    const bindElements = function()
    {
        const elements = trigHdlr(this,'specificMulti:getFormElements');
        
        setHdlrs(elements,'specificMulti:',{
            
            isActive: function() {
                const checkbox = trigHdlr(this,'specificMulti:getCheckbox');
                return $(checkbox).is(':checked');
            },
            
            getCheckbox: function() {
                return qs(this,".disabler input[type='checkbox']");
            },
            
            getComponent: function() {
                return qs(this,'.specific-component');
            },
            
            refresh: function() {
                const isActive = trigHdlr(this,'specificMulti:isActive');
                const component = trigHdlr(this,'specificMulti:getComponent');
                setAttr(this,'data-disabled',(isActive === true)? 0:1);
                trigEvt(component,(isActive === true)? 'component:enable':'component:disable');
            }
        });
        
        aelOnce(elements,'component:setup',function() {
            const $this = this;
            const checkbox = trigHdlr(this,'specificMulti:getCheckbox');
            
            ael(checkbox,'change',function(event) {
                trigHdlr($this,'specificMulti:refresh');
            });
            
            trigHdlr(this,'specificMulti:refresh');
        });
        
        trigSetup(elements);
    }
    
    
    return this;
}