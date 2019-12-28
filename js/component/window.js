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
    Dom.checkNode(this,window);
    
    
    // handler
    setHdlrs(this,'window:',{
        // retourne vrai si le navigateur courant supporte le touch
        isTouch: function() {
            return (getData(this,'window-isTouch') === true)? true:false;
        },
        
        // retourne vrai si la fenêtre courante est responsive
        isResponsive: function() {
            return (Dom.getWidth(this) < 900)? true:false;
        },
        
        // permet de scroller la fenêtre
        scrollTo: function(top) {
            const htmlBody = qsa(document,"html,body");
            
            DomChange.animateStop(htmlBody);
            
            Dom.each(htmlBody,function() {
                DomChange.setScroll(this,top);
            });
        }
    });
    
    // sur le premier isTouch
    aelOnce(document,'touchstart',function() {
        setData(window,'window-isTouch',true);
    });
        
    return this;
}