/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */
 
// keyboardArrow
// attrape les touches de flèche sur le clavier
// par défaut l'événement est prevent
quid.component.keyboardArrow = function(prevent,type) 
{
    quid.component.keyboard.call(this,'arrow',[37,38,39,40],type);
    
    $(this).on('arrow:catched', function(event,keyEvent,isInput,keyCode) {
        if(keyCode === 38)
        $(this).trigger('arrowUp:catched',[keyEvent,isInput]);
        
        else if(keyCode === 40)
        $(this).trigger('arrowDown:catched',[keyEvent,isInput]);
        
        else if(ekeyCode === 37)
        $(this).trigger('arrowLeft:catched',[keyEvent,isInput]);
        
        else if(keyCode === 39)
        $(this).trigger('arrowRight:catched',[keyEvent,isInput]);
    })
    .on('arrow:prevent', function(event) {
        return (prevent === true)? true:false;
    });  
    
    return this;
}