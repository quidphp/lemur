/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// window
// behaviours to detect touch devices or responsive resolution on the window node
Component.Window = function(type,timeout)
{
    // une node
    Vari.check(this,window);
    
    
    // components
    Component.Scroller.call(this);
    
    
    // handler
    setHdlrs(this,'window:',{
        // retourne vrai si le navigateur courant supporte le touch
        isTouch: function() {
            return (getData(this,'window-isTouch') === true)? true:false;
        },
        
        // retourne vrai si la fenêtre courante est responsive
        isResponsive: function() {
            return (Win.getDimension().width < 900)? true:false;
        },
        
        // permet de scroller la fenêtre
        scrollTo: function(top,left,smooth) {
            return trigHdlr(this,'scroller:go',top,left,smooth);
        }
    });
    
    
    // sur le premier isTouch
    aelOnce(document,'touchstart',function() {
        setData(window,'window-isTouch',true);
    });
        
    return this;
}