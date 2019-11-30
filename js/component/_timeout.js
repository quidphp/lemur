/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// timeout
// script of behaviours for a timeout component
// permet d'appliquer un timeout sur un événement
quid.component.timeout = function(type,timeout)
{
    if(quid.str.isNotEmpty(type))
    {
        $(this).each(function(index) 
        {
            var delay = timeout || $(this).data(type+"Delay") || 500;
            
            if(quid.number.is(delay))
            {
                $(this).on(type+':setTimeout',function() {
                    var $this = $(this);
                    var $type = type;
                    $(this).trigger(type+':clearTimeout');
                    $(this).data(type+"Timeout",setTimeout(function() {
                        $this.trigger($type+':onTimeout');
                    },delay));
                })
                .on(type+':clearTimeout',function() {
                    var oldTimeout = $(this).data(type+"Timeout");
                    
                    if(oldTimeout != null)
                    clearTimeout(oldTimeout);
                })
                .on(type, function() {
                    $(this).trigger(type+':setTimeout');
                });
            }
        });
    }
    
    return this;
}