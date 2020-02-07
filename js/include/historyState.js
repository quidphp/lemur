/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// historyState
// script with functions related to the history states
const HistoryState = Lemur.HistoryState = {
    
    // is
    // retourne vrai si la valeur est un objet compatible pour un état d'historique
    is: function(state)
    {
        let r = false;
        
        if(Pojo.is(state) && Str.is(state.url) && Num.is(state.timestamp))
        r = true;
        
        return r;
    },
    
    
    // isChangeValid
    // retourne vrai si le changement de state est valide
    isChangeValid: function(state,previous,differentPathQuery)
    {
        let r = false;
        
        if(this.is(state) && this.is(previous))
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
    
    
    // make
    // retourne un objet état d'historique (avec url absolute, title et timestamp)
    make: function(value,title,noEmptyHash) 
    {
        let r = null;
        
        if(Str.is(value))
        {
            let uri = Uri.absolute(value,true);
            const valueEndsHash = Str.isEnd('#',value);
            const uriEndsHash = Str.isEnd('#',uri);
            
            if(noEmptyHash === true && uriEndsHash === true)
            uri = uri.slice(0,-1);
            
            else if(noEmptyHash !== true && valueEndsHash === true && uriEndsHash === false)
            uri += "#";
            
            r = {
                url: uri,
                title: title || null,
                timestamp: Datetime.now()
            };
        }
        
        return r;
    }
}