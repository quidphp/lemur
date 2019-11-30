/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// windowSmall
// permet l'ouverture d'une smallWindow
// tous les paramètres de la window sont dans la balise
quid.component.windowSmall = function() 
{    
    quid.dom.addId('window-small-',this);
    
    $(this).on('click', function(event) {
        var win = window;
        var href = $(this).attr('href');
        var id = $(this).prop('id');
        var width = $(this).data('width') || 1000;
        var height = $(this).data('height') || 1000;
        var x = $(this).data('x') || 0;
        var y = $(this).data('y') || 0;
        
        if(quid.number.is(width) && quid.number.is(height) && quid.number.is(x) && quid.number.is(y))
        {
            event.preventDefault();
            var param = "toolbar=no ,left="+x+",top="+y+",width="+width+",height="+height+",location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no";
            var child = win.open(href,id,param);
            child.focus();
            win.blur();
            return false;
        }
    });
    
    return this;
}