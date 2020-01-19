/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// initOpenClose
// base component used for opening, closing and initializing a container
Component.InitOpenClose = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        type: null,
        attr: null,
        attrInit: 'data-init'
    },option);
    
    
    // check
    const type = $option.type;
    Str.check(type);
    Str.check($option.attr);
    Str.check($option.attrInit);
    
    
    // handler
    setHdlrs(this,type+':',{
        
        isBinded: function() {
            return true;
        },
        
        isInit: function() {
            return (getData(this,type+'-init') === true);
        },
        
        isDisabled: function() {
            return getAttr(this,'data-disabled','int') === 1;
        },
        
        isOpen: function() {
            return (getAttr(this,$option.attr,'int') === 1);
        },
        
        canOpen: function() {
            return trigHdlr(this,type+':isDisabled') ? false:true;
        },
        
        disable: function() {
            setAttr(this,'data-disabled',1);
        },
        
        enable: function() {
            setAttr(this,'data-disabled',0);
        }
    });
    
    
    // event
    ael(this,type+':open',function() {
        
        if(trigHdlr(this,type+':isOpen') !== true && trigHdlr(this,type+':canOpen') === true)
        {
            let isInit = false;
            
            if(trigHdlr(this,type+':isInit') !== true)
            {
                isInit = true;
                trigEvt(this,type+':init');
                setData(this,type+'-init',true);
                setAttr(this,$option.attrInit,1);
            }
            
            trigHdlr(this,type+':willOpen',isInit);
            setAttr(this,$option.attr,1);
            trigEvt(this,type+':opened',isInit);
        }
    });
    
    ael(this,type+':close',function() {
        if(trigHdlr(this,type+':isOpen') === true)
        {
            setAttr(this,$option.attr,0);
            trigEvt(this,type+':closed');
        }
    });
    
    return this;
}