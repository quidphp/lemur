/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardArrow
// attrape les touches de flèche sur le clavier
// par défaut l'événement est prevent
Component.keyboardArrow = function(prevent,type) 
{
    Component.keyboard.call(this,'arrow',[37,38,39,40],type);
    
    $(this).on('arrow:catched', function(event,keyEvent,isInput,keyCode) {
        if(keyCode === 38)
        triggerCustom(this,'arrowUp:catched',[keyEvent,isInput]);
        
        else if(keyCode === 40)
        triggerCustom(this,'arrowDown:catched',[keyEvent,isInput]);
        
        else if(ekeyCode === 37)
        triggerCustom(this,'arrowLeft:catched',[keyEvent,isInput]);
        
        else if(keyCode === 39)
        triggerCustom(this,'arrowRight:catched',[keyEvent,isInput]);
    })
    .on('arrow:prevent', function(event) {
        return (prevent === true)? true:false;
    });  
    
    return this;
}