/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// initOpenClose
// base component used for opening, closing and initializing a container
Component.InitOpenClose = function(type,attr)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // check
    Str.check(type);
    Str.check(attr);
    
    
    // handler
    setHdlrs(this,type+':',{
        
        isBinded: function() {
            return true;
        },
        
        isInit: function() {
            return (getData(this,type+'-init') === true);
        },
        
        isDisabled: function() {
            return Dom.getAttrInt(this,'data-disabled') === 1;
        },
        
        isOpen: function() {
            return (Dom.getAttrInt(this,attr) === 1);
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
            setAttr(this,attr,1);
            
            if(trigHdlr(this,type+':isInit') !== true)
            {
                isInit = true;
                trigEvt(this,type+':init');
                setData(this,type+'-init',true);
            }
            
            trigEvt(this,type+':opened',isInit);
        }
    });
    
    ael(this,type+':close',function() {
        if(trigHdlr(this,type+':isOpen') === true)
        {
            setAttr(this,attr,0);
            
            trigEvt(this,type+':closed');
        }
    });
    
    return this;
}