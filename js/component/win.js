/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// win
// behaviours for managing the events and unload notification with the window object
const Win = function(type,timeout)
{
    // nodes
    const $nodes = this;
    
    
    // func
    
    // retourne vrai si la fenêtre courante est responsive
    setFunc(this,'win:isResponsive',function() {
        return ($(window).width() < 900)? true:false;
    });

    setFunc(this,'win:isUnloadValid',function() {
        let r = false;
        const unload = triggerFunc(this,'win:unloadText');
        
        if(!Str.isNotEmpty(unload) || confirm(unload))
        r = true;
        
        return r;
    });
    
    setFunc(this,'win:addUnloadNode',function(node) {
        const nodes = triggerFunc(this,'win:getUnloadNodes');
        
        $(node).each(function() {
            nodes.push(this);
        });
    });
    
    setFunc(this,'win:removeUnloadNode',function(node) {
        const nodes = triggerFunc(this,'win:getUnloadNodes');
        
        $(node).each(function() {
            Arr.spliceValue(this,nodes);
        });
    });
    
    setFunc(this,'win:getUnloadNodes',function(node) {
        return Dom.getOrSetData(this,'win-unload-nodes',[]);
    });
    
    setFunc(this,'win:unloadText',function() {
        let r = null;
        const nodes = triggerFunc(this,'win:getUnloadNodes');
        
        $(nodes).each(function() {
            r = triggerFunc(this,'win:unloadText');
            
            if(Str.isNotEmpty(r))
            return false;
        });
        
        return r;
    });
    
    
    // event
    ael(this,'beforeunload',function(event) {
        let r = undefined;
        event = event || window.event;
        const text = triggerFunc(this,'win:unloadText');
        
        if(Str.isNotEmpty(text))
        {
            r = text;
            event.returnValue = r;
        }
        
        return r;
    });
    
    return this;
}

// export
Component.Win = Win;