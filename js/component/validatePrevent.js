/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// validatePrevent
// component that blocks an event if the validation is not successfull
Component.ValidatePrevent = function(type) 
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlr(this,'validatePrevent:getTargets',function(event) {
        return this;
    });
    
    setHdlr(this,'validatePrevent:trigger',function(event) {
        let r = true;
        const targets = trigHdlr(this,'validatePrevent:getTargets');
        
        if(Vari.isNotEmpty(targets))
        {
            Dom.each(targets,function() {
                const val = trigHdlr(this,"validate:trigger");
                
                if(val === false)
                r = val;
            });
        }
        
        return r;
    });
    
    
    // event
    ael(this,type,function(event) {
        let r = trigHdlr(this,'validatePrevent:trigger')
        
        if(r !== true)
        {
            Evt.preventStop(event,true);
            trigEvt(this,'validatePrevent:deny',event);
        }
        
        else
        trigEvt(this,'validatePrevent:allow',event);
        
        return r;
    });
    
    
    // setup
    aelOnce(this,'component:setup', function(event) {
        const targets = trigHdlr(this,'validatePrevent:getTargets');
        
        Dom.each(targets,function() {
            if(!trigHdlr(this,'validate:isBinded'))
            Component.Validate.call(this);
        });
        
        trigSetup(targets);
    });
    
    return this;
}