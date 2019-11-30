/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// fragment
// gère les changements de fragment
quid.component.fragment = function() 
{
    $(this).on('fragment:get', function(event) {
        return $(this).data('fragment');
    })
    .on('fragment:update', function(event,replaceState) {
        var current = quid.request.fragment();
        var fragment = $(this).triggerHandler('fragment:get');
        var hasHistoryApi = $(document).triggerHandler('document:hasHistoryApi');
        
        if(current !== fragment)
        {
            if(quid.str.isNotEmpty(fragment))
            {
                var fragmentHash = '#'+fragment;
                
                if(hasHistoryApi === true && replaceState === true)
                $(document).triggerHandler('document:replaceState',quid.request.relative()+fragmentHash);
                else
                window.location.hash = fragmentHash;
            }
            
            else
            $(this).trigger('fragment:remove',[replaceState]);
            
            $(this).trigger('fragment:updated',[fragment]);
        }
    })
    .on('fragment:remove', function(event) {
        if(hasHistoryApi === true && replaceState === true)
        $(document).triggerHandler('document:replaceState',quid.request.relative());
        else
        window.location.hash = '';
    });
    
    return this;
}