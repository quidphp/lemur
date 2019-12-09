/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// windowSmall
// permet l'ouverture d'une smallWindow
// tous les paramètres de la window sont dans la balise
Component.windowSmall = function() 
{    
    DomChange.addId('window-small-',this);
    
    $(this).on('click',function(event) {
        const win = window;
        const href = $(this).attr('href');
        const id = $(this).prop('id');
        const width = $(this).data('width') || 1000;
        const height = $(this).data('height') || 1000;
        const x = $(this).data('x') || 0;
        const y = $(this).data('y') || 0;
        
        if(Num.is(width) && Num.is(height) && Num.is(x) && Num.is(y))
        {
            event.preventDefault();
            const param = "toolbar=no ,left="+x+",top="+y+",width="+width+",height="+height+",location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no";
            const child = win.open(href,id,param);
            child.focus();
            win.blur();
            return false;
        }
    });
    
    return this;
}