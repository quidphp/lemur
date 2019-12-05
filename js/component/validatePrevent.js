/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validatePrevent
// component that blocks an event if the validation is not successfull
const ValidatePrevent = function(type) 
{
    // nodes
    const $nodes = this;
    
    
    // func
    setFunc(this,'validatePrevent:getTargets',function(event) {
        return this;
    });
    
    setFunc(this,'validatePrevent:trigger',function(event) {
        let r = true;
        const targets = triggerFunc(this,'validatePrevent:getTargets');
        
        $(targets).each(function(index, el) {
            const val = triggerFunc(this,"validate:trigger");
            
            if(val === false)
            r = val;
        });
        
        return r;
    });
    
    
    // event
    ael(this,type,function(event) {
        let r = triggerFunc(this,'validatePrevent:trigger')
        
        if(r !== true)
        {
            event.stopImmediatePropagation();
            event.preventDefault();
            triggerCustom(this,'validatePrevent:deny',event);
        }
        
        else
        triggerCustom(this,'validatePrevent:allow',event);
        
        return r;
    });
    
    
    // setup
    aelOnce(this,'component:setup', function(event) {
        const targets = triggerFunc(this,'validatePrevent:getTargets');
        
        $(targets).each(function() {
            if(!triggerFunc(this,'validate:isBinded'))
            Component.Validate.call(this);
        });
        
        triggerCustom(targets,'validate:setup');
    });
    
    return this;
}

// export
Component.ValidatePrevent = ValidatePrevent;