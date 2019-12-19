/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// navHash
// adds hashchange support for the nav index component
Component.NavHash = function(option)
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // option
    const $option = Pojo.replace({
        persistent: false,
        type: null,
        child: null,
        hash: 'data-hash'
    },option);
    
    
    // check
    Str.check($option.type);
    Str.check($option.child);
    const type = $option.type;
    const child = $option.child;
    
    
    // components
    Component.HashChange.call(this,$option.persistent);
    
    
    // handler
    setHdlrs(this,'navHash:',{
        
        isHash: function(value) {
            return (trigHdlr(this,'navHash:getHash',value) != null);
        },
        
        getHash: function(value) {
            let r = undefined;
            value = Uri.makeHash(value,false);
            const targets = trigHdlr(this,type+':getTargets');
            
            if(Str.isEmpty(value))
            r = Arr.valueFirst(targets);
            
            else
            r = Arr.find(targets,function() {
                return (trigHdlr(this,child+':getHash') === value);
            });
            
            return r;
        },
        
        getCurrentHash: function() {
            const target = trigHdlr(this,type+':getCurrent');
            
            if(target != null)
            return trigHdlr(target,child+':getHash');
        },
        
        setupFragment: function() {
            return Request.fragment();
        }
    });
    
    setHdlr(this,type+':readyValue',function(value) {
        if(value === true)
        {
            value = null;
            const setupHash = trigHdlr(this,'navHash:setupFragment');
            if(Str.isNotEmpty(setupHash))
            value = "#"+setupHash;
        }
        
        if(Str.isStart("#",value))
        {
            const node = trigHdlr(this,'navHash:getHash',value);
            if(node != null)
            value = node;
        }
        
        return (value == null)? 'first':value;
    });
    
    
    // event
    ael(this,'hash:change',function() {
        const hash = Request.fragment();
        const current = trigHdlr(this,'navHash:getCurrentHash');
        
        if(!Str.isEqual(hash,current))
        trigHdlr(this,type+':go',"#"+hash,'hashchange');
    });
    
    ael(this,type+':afterChange',function(event,target,old) {
        const hash = Request.fragment();
        const current = trigHdlr(this,'navHash:getCurrentHash');
        
        if(hash == null && Str.isNotEmpty(current))
        trigHdlr(document,'history:replaceHash',current);
    });
    
    ael(this,type+':bindChilds',function(event,value) {
        bindChilds.call(this,value);
    });
    

    // bindChilds
    const bindChilds = function(value)
    {
        setHdlr(value,child+':getHash',function() {
            return getAttr(this,$option.hash);
        });
    }
    
    return this;
}