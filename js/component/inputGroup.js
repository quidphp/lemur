/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputGroup
// script with behaviours for an input group component (like checkbox and radio)
Component.InputGroup = function() 
{    
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    setHdlr(this,'inputGroup:isChecked',function() {
        return (getProp(this,'checked') === true)? true:false;
    });
    
    setHdlr(this,'inputGroup:getValue',function() {
        let r = undefined;
        const group = trigHdlr(this,'inputGroup:getChecked');
        
        if(Arr.isNotEmpty(group))
        {
            r = [];
            Arr.each(group,function() {
                const value = trigHdlr(this,'input:getValue');
                r.push(value);
            });
        }
        
        return r;
    });
    
    setHdlr(this,'inputGroup:get',function() {
        let r = null;
        const parent = trigHdlr(this,'input:getParent');
        const name = trigHdlr(this,'input:getName');
        const type = trigHdlr(this,'input:getType');
        const tag = trigHdlr(this,'input:getTag');
        
        if(Str.isNotEmpty(name) && Str.isNotEmpty(tag))
        {
            const typeSearch = (Str.isNotEmpty(type))? "[type='"+type+"']":tag;
            r = qsa(parent,typeSearch+"[name='"+name+"']");
        }
        
        return r;
    });
    
    setHdlr(this,'inputGroup:getChecked',function() {
        let r = null;
        const group = trigHdlr(this,'inputGroup:get');
        
        if(Arr.isNotEmpty(group))
        {
            r = [];
            Arr.each(group,function() {
                if(trigHdlr(this,'inputGroup:isChecked'))
                r.push(this);
            });
        }
        
        return r;
    });
    
    return this;
}