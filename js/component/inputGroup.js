/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// inputGroup
// script with behaviours for an input group component (like checkbox and radio)
const InputGroup = Component.InputGroup = function() 
{    
    setHandler(this,'inputGroup:isChecked',function() {
        return ($(this).prop('checked') === true)? true:false;
    });
    
    setHandler(this,'inputGroup:getValue',function() {
        let r = undefined;
        const group = trigHandler(this,'inputGroup:getChecked');
        
        if(Arr.isNotEmpty(group))
        {
            r = [];
            Arr.each(group,function() {
                const value = trigHandler(this,'input:getValue');
                r.push(value);
            });
        }
        
        return r;
    });
    
    setHandler(this,'inputGroup:get',function() {
        let r = null;
        const parent = trigHandler(this,'input:getParent');
        const name = trigHandler(this,'input:getName');
        const type = trigHandler(this,'input:getType');
        const tag = trigHandler(this,'input:getTag');
        
        if(Str.isNotEmpty(name) && Str.isNotEmpty(tag))
        {
            const typeSearch = (Str.isNotEmpty(type))? "[type='"+type+"']":tag;
            r = qsa(parent,typeSearch+"[name='"+name+"']");
        }
        
        return r;
    });
    
    setHandler(this,'inputGroup:getChecked',function() {
        let r = null;
        const group = trigHandler(this,'inputGroup:get');
        
        if(Arr.isNotEmpty(group))
        {
            r = [];
            Arr.each(group,function() {
                if(trigHandler(this,'inputGroup:isChecked'))
                r.push(this);
            });
        }
        
        return r;
    });
    
    return this;
}