/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// historyApi
// script with functions related to the history API
const HistoryApi = Lemur.HistoryApi = Factory(true,
{    
    // supported
    // retourne vrai si le navigateur courant supporte history API
    supported: function()
    {
        let r = false;
        
        if(window.history && window.history.pushState && window.history.replaceState)
        {
            if(!navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/))
            r = true;
        }
        
        return r;
    },

    
    // isState
    // retourne vrai si la valeur est un objet compatible pour un état d'historique
    isState: function(state)
    {
        let r = false;
        
        if(Pojo.is(state) && Str.is(state.url) && Num.is(state.timestamp))
        r = true;
        
        return r;
    },
    
    
    // isStateChangeValid
    // retourne vrai si le changement de state est valide
    isStateChangeValid: function(state,previous,differentPathQuery)
    {
        let r = false;
        
        if(this.isState(state) && this.isState(previous))
        {
            const isInternal = Uri.isInternal(state.url,previous.url);
            const hasExtension = Uri.hasExtension(state.url);
            const isHashChange = Uri.isHashChange(state.url,previous.url);
            const isSameWithHash = Uri.isSameWithHash(state.url,previous.url);
            
            if(isInternal === true && hasExtension === false && isHashChange === false && isSameWithHash === false)
            {
                if(!differentPathQuery || Uri.isSamePathQuery(state.url,previous.url) === false)
                r = true;
            }
        }
        
        return r;
    },
    
    
    // makeState
    // retourne un objet état d'historique (avec url, title et timestamp)
    makeState: function(uri,title) 
    {
        let r = null;
        
        if(Str.is(uri))
        {
            r = {
                url: uri,
                title: title || null,
                timestamp: Datetime.now()
            };
        }
        
        return r;
    }
});