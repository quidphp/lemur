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
    setHdlr(this,'win:isResponsive',function() {
        return ($(window).width() < 900)? true:false;
    });

    setHdlr(this,'win:isUnloadValid',function() {
        let r = false;
        const unload = trigHdlr(this,'win:unloadText');
        
        if(!Str.isNotEmpty(unload) || confirm(unload))
        r = true;
        
        return r;
    });
    
    setHdlr(this,'win:addUnloadNode',function(node) {
        const nodes = trigHdlr(this,'win:getUnloadNodes');
        
        $(node).each(function() {
            nodes.push(this);
        });
    });
    
    setHdlr(this,'win:removeUnloadNode',function(node) {
        const nodes = trigHdlr(this,'win:getUnloadNodes');
        
        $(node).each(function() {
            Arr.spliceValue(this,nodes);
        });
    });
    
    setHdlr(this,'win:getUnloadNodes',function(node) {
        return Dom.getOrSetData(this,'win-unload-nodes',[]);
    });
    
    setHdlr(this,'win:unloadText',function() {
        let r = null;
        const nodes = trigHdlr(this,'win:getUnloadNodes');
        
        $(nodes).each(function() {
            r = trigHdlr(this,'win:unloadText');
            
            if(Str.isNotEmpty(r))
            return false;
        });
        
        return r;
    });
    
    
    // event
    ael(this,'beforeunload',function(event) {
        let r = undefined;
        event = event || window.event;
        const text = trigHdlr(this,'win:unloadText');
        
        if(Str.isNotEmpty(text))
        {
            r = text;
            event.returnValue = r;
        }
        
        return r;
    });
    
    ael(this,'unload',function() {
        trigHdlr(document,'doc:unload');
    });
    
    return this;
}