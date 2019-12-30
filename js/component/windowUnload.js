/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// windowUnload
// component to manage the unload notification with the window object
Component.WindowUnload = function(type,timeout)
{
    // une node
    Vari.check(this,window);
    
    
    // handler
    setHdlrs(this,'windowUnload:',{
        
        isValid: function() {
            let r = false;
            const unload = trigHdlr(this,'windowUnload:getText');
            
            if(!Str.isNotEmpty(unload) || confirm(unload))
            r = true;
            
            return r;
        },
        
        addNode: function(node) {
            const nodes = trigHdlr(this,'windowUnload:getNodes');
            
            Ele.each(node,function() {
                nodes.push(this);
            });
        },
        
        removeNode: function(node) {
            const nodes = trigHdlr(this,'windowUnload:getNodes');
            
            Ele.each(node,function() {
                Arr.spliceValue(this,nodes);
            });
        },
        
        getNodes: function(node) {
            return Win.getOrSetData(this,'window-unload-nodes',[]);
        },
        
        getText: function() {
            let r = null;
            const nodes = trigHdlr(this,'windowUnload:getNodes');
            
            Arr.each(nodes,function() {
                r = trigHdlr(this,'windowUnload:getText');
                
                if(Str.isNotEmpty(r))
                return false;
            });
            
            return r;
        }
    });
    

    // event
    ael(this,'beforeunload',function(event) {
        let r = undefined;
        event = event || window.event;
        const text = trigHdlr(this,'windowUnload:getText');
        
        if(Str.isNotEmpty(text))
        {
            r = text;
            event.returnValue = r;
        }
        
        return r;
    });
    
    ael(this,'unload',function() {
        trigHdlr(document,'doc:unmount');
    });
    
    return this;
}