/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// clickPrint
// component that triggers a window print on click
const ClickPrint = function()
{
    // nodes
    const $nodes = this;
    
    
    // event
    ael(this,'click',function() {
        window.print();
    });
    
    
    return this;
}

// export
Component.ClickPrint = ClickPrint;