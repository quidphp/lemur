/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// background
// component for a background that can fadein or out
Component.Background = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlrs(this,'background:',{
        
        // retourne vrai si le background existe et est présentement actif
        isActive: function() {
            return (getAttr(this,'data-from') != null)? true:false;
        },
        
        // permet d'ajouter une attribut data au background
        set: function(value,replace) {
            let r = false;
            
            if(Str.isNotEmpty(value))
            {
                if(replace === true || getAttr(this,'data-from') == null)
                {
                    r = true;
                    setAttr(this,'data-from',value);
                    trigHdlr(this,'background:changed',value);
                }
            }
            
            return r;
        },
        
        // enlève les attributs du background
        unset: function(value) {
            let r = false;
            
            if(trigHdlr(this,'background:isActive'))
            {
                if(value == null || value === getAttr(this,'data-from'))
                {
                    r = true;
                    Ele.removeAttr(this,'data-from');
                    trigHdlr(this,'background:changed',undefined);
                }
            }
            
            return r;
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        documentBind.call(this);
    });
    
    
    // documentBind
    const documentBind = function() 
    {
        const background = this;
        
        setHdlr(document,'doc:getBackground',function() {
            return background;
        });
        
        ael(document,'doc:unmountPage',function() {
            trigHdlr(background,'background:unset');
        });

        ael(this,'click',function() {
            trigHdlr(this,'background:unset');
        });
    }
    
    return this;
}