/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickPrint
// component that triggers a window print on click
Component.ClickPrint = function()
{
    // not empty
    if(Vari.isEmpty(this)) 
    return null;
    
    
    // event
    ael(this,'click',function() {
        window.print();
    });
    
    return this;
}