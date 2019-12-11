/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// win
// behaviours for managing the events and unload notification with the window object
const Win = Component.Win = function(type,timeout)
{
    // une node
    Dom.checkNode(this);
    
    
    // handler
    
    // retourne vrai si la fenêtre courante est responsive
    setHandler(this,'win:isResponsive',function() {
        return ($(window).width() < 900)? true:false;
    });

    setHandler(this,'win:isUnloadValid',function() {
        let r = false;
        const unload = trigHandler(this,'win:unloadText');
        
        if(!Str.isNotEmpty(unload) || confirm(unload))
        r = true;
        
        return r;
    });
    
    setHandler(this,'win:addUnloadNode',function(node) {
        const nodes = trigHandler(this,'win:getUnloadNodes');
        
        $(node).each(function() {
            nodes.push(this);
        });
    });
    
    setHandler(this,'win:removeUnloadNode',function(node) {
        const nodes = trigHandler(this,'win:getUnloadNodes');
        
        $(node).each(function() {
            Arr.spliceValue(this,nodes);
        });
    });
    
    setHandler(this,'win:getUnloadNodes',function(node) {
        return Dom.getOrSetData(this,'win-unload-nodes',[]);
    });
    
    setHandler(this,'win:unloadText',function() {
        let r = null;
        const nodes = trigHandler(this,'win:getUnloadNodes');
        
        $(nodes).each(function() {
            r = trigHandler(this,'win:unloadText');
            
            if(Str.isNotEmpty(r))
            return false;
        });
        
        return r;
    });
    
    
    // event
    ael(this,'beforeunload',function(event) {
        let r = undefined;
        event = event || window.event;
        const text = trigHandler(this,'win:unloadText');
        
        if(Str.isNotEmpty(text))
        {
            r = text;
            event.returnValue = r;
        }
        
        return r;
    });
    
    ael(this,'unload',function() {
        trigHandler(document,'doc:unload');
    });
    
    return this;
}