/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// searchAutoInfo
// script with logic for an auto-complete search component with another info popup when value is empty
const SearchAutoInfo = Component.SearchAutoInfo = function(option)
{
    // option
    const $option = Pojo.replaceRecursive({
        targetInfo: ".search-info",
        attrInfo: 'data-search-info',
        background: "searchAutoInfo",
        inputSearch: {
            useCurrent: false
        },
        info: {
            background: "searchAutoInfo",
        }
    },option);
    
    
    // components
    Component.ClickOpenInputAjax.call(this,$option);
    
    
    // handler
    setHdlr(this,'searchAutoInfo:getInfo',function() {
        return qs(this,$option.targetInfo);
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindInfo.call(this);
        bindField.call(this);
    });
    
    
    // bindInfo
    const bindInfo = function() 
    {
        const $this = this;
        const info = trigHdlr(this,'searchAutoInfo:getInfo');
        
        Component.ClickOpen.call(info,$option.info)
        
        ael(info,'clickOpen:opened',function() {
            $($this).attr($option.attrInfo,1);
        });
        
        ael(info,'clickOpen:closed',function() {
            $($this).attr($option.attrInfo,0);
        });
        
        trigSetup(info);
    }
    
    
    // bindField
    const bindField = function() 
    {
        const info = trigHdlr(this,'searchAutoInfo:getInfo');
        const field = trigHdlr(this,'form:getValidateField');
        
        ael(field,'click',function() {
            if(trigHdlr(this,'validate:isEmpty'))
            trigEvt(info,'clickOpen:open');
        });
        
        ael(field,'validate:empty',function() {
            if($(this).is(":focus"))
            trigEvt(info,'clickOpen:open');
        });
        
        ael(field,'validate:notEmpty',function() {
            trigEvt(info,'clickOpen:close');
        });
        
        ael(field,'keyboardEscape:blocked',function(event) {
            trigEvt(info,'clickOpen:close');
        });
    }
    
    return this;
}