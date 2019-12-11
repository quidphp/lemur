/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// fragment
// gère les changements de fragment
Component.fragment = function() 
{
    $(this).on('fragment:get',function(event) {
        return $(this).data('fragment');
    })
    .on('fragment:update',function(event,replaceState) {
        const current = Request.fragment();
        const fragment = trigHandler(this,'fragment:get');
        const hasHistoryApi = trigHandler(document,'doc:hasHistoryApi');
        
        if(current !== fragment)
        {
            if(Str.isNotEmpty(fragment))
            {
                const fragmentHash = '#'+fragment;
                
                if(hasHistoryApi === true && replaceState === true)
                trigHandler(document,'doc:replaceState',Request.relative()+fragmentHash);
                else
                window.location.hash = fragmentHash;
            }
            
            else
            trigEvt(this,'fragment:remove',replaceState);
            
            trigEvt(this,'fragment:updated',fragment);
        }
    })
    .on('fragment:remove',function(event) {
        if(hasHistoryApi === true && replaceState === true)
        trigHandler(document,'doc:replaceState',Request.relative());
        else
        window.location.hash = '';
    });
    
    return this;
}