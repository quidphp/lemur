<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;

// _popup
// trait that provides some initial configuration for a CMS popup route
trait _popup
{
    // trait
    use _common;
    
    
    // config
    public static $configPopup = [
        'match'=>[
            'ajax'=>true,
            'role'=>['>'=>'user']],
        'group'=>'popup',
        'history'=>false
    ];
    
    
    // onBefore
    // vérifie que la permission est la
    final protected function onBefore()
    {
        return $this->canTrigger();
    }


    // triger
    // lance la route
    final public function trigger():string
    {
        return $this->popup();
    }


    // popup
    // génère le popup d'informations pour la session
    final protected function popup():?string
    {
        $return = null;
        $values = $this->getAttr('popup');
        $closure = $this->popupClosure();
        $return = static::makeInfoPopup($values,$closure,false);

        return $return;
    }
}
?>