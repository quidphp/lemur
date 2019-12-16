/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// winUnload
// component to manage the unload notification with the window object
Component.WinUnload = function(type,timeout)
{
    // une node
    Dom.checkNode(this,window);
    
    
    // handler
    setHdlrs(this,'winUnload:',{
        
        isValid: function() {
            let r = false;
            const unload = trigHdlr(this,'winUnload:getText');
            
            if(!Str.isNotEmpty(unload) || confirm(unload))
            r = true;
            
            return r;
        },
        
        addNode: function(node) {
            const nodes = trigHdlr(this,'winUnload:getNodes');
            
            Dom.each(node,function() {
                nodes.push(this);
            });
        },
        
        removeNode: function(node) {
            const nodes = trigHdlr(this,'winUnload:getNodes');
            
            Dom.each(node,function() {
                Arr.spliceValue(this,nodes);
            });
        },
        
        getNodes: function(node) {
            return Dom.getOrSetData(this,'win-unload-nodes',[]);
        },
        
        getText: function() {
            let r = null;
            const nodes = trigHdlr(this,'winUnload:getNodes');
            
            Arr.each(nodes,function() {
                r = trigHdlr(this,'winUnload:getText');
                
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
        const text = trigHdlr(this,'winUnload:getText');
        
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