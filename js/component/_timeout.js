/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// timeout
// script of behaviours for a timeout component
// permet d'appliquer un timeout sur un événement
Component.timeout = function(type,timeout)
{
    if(Str.isNotEmpty(type))
    {
        $(this).each(function(index) 
        {
            const delay = timeout || $(this).data(type+"Delay") || 500;
            
            if(Num.is(delay))
            {
                $(this).on(type+':setTimeout',function() {
                    const $this = $(this);
                    const $type = type;
                    triggerCustom(this,type+':clearTimeout');
                    $(this).data(type+"Timeout",setTimeout(function() {
                        $this.trigger($type+':onTimeout');
                    },delay));
                })
                .on(type+':clearTimeout',function() {
                    const oldTimeout = $(this).data(type+"Timeout");
                    
                    if(oldTimeout != null)
                    clearTimeout(oldTimeout);
                })
                .on(type, function() {
                    triggerCustom(this,type+':setTimeout');
                });
            }
        });
    }
    
    return this;
}