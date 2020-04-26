/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// specificNav
// component that manages the navigation box on the specific form page of the CMS
Component.SpecificNav = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // handler
    setHdlrs(this,'specificNav:',{
        
        getLinks: function() {
            return qsa(this,"a.hash-follow");
        },
        
        getInput: function() {
            return qs(this,".count-input > input[type='text']");
        },
        
        setHash: function(value) {
            saveNewHash.call(this,Str.typecheck(value));
        }
    });
    
    
    // setup
    aelOnce(this,'component:setup',function() {
        bindInputPosition.call(this);
    });
    
    
    // bindInputPosition
    const bindInputPosition = function()
    {
        const input = trigHdlr(this,'specificNav:getInput');
        Component.InputNumericHref.call(input);
    }
    
    
    // saveNewHash
    const saveNewHash = function(hash)
    {
        const links = trigHdlr(this,'specificNav:getLinks');
        const input = trigHdlr(this,'specificNav:getInput');

        Arr.each(links,function() {
            this.hash = hash;
        });
        
        if(input != null)
        {
            let countHref = getAttr(input,'data-href');
            const newHref = Uri.build({ pathname: Uri.path(countHref), search: { panel: hash}});
            setAttr(input,'data-href',newHref)
        }
    }
    
    return this;
}