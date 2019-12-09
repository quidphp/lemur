/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickPrint
// component that triggers a window print on click
const ClickPrint = Component.ClickPrint = function()
{
    // event
    ael(this,'click',function() {
        window.print();
    });
    
    return this;
}