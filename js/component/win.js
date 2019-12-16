/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// win
// behaviours to detect touch devices or responsive resolution on the window node
Component.Win = function(type,timeout)
{
    // une node
    Dom.checkNode(this,window);
    
    
    // handler
    setHdlrs(this,'win:',{
        // retourne vrai si le navigateur courant supporte le touch
        isTouch: function() {
            return (getData(this,'win-isTouch') === true)? true:false;
        },
        
        // retourne vrai si la fenêtre courante est responsive
        isResponsive: function() {
            return ($(this).width() < 900)? true:false;
        },
        
        // permet de scroller la fenêtre
        scrollTo: function(top) {
            const htmlBody = qsa(document,"html,body");
            $(htmlBody).stop(true,true).scrollTop(top);
        }
    });
    
    // sur le premier isTouch
    aelOnce(document,'touchstart',function() {
        setData(window,'win-isTouch',true);
    });
        
    return this;
}