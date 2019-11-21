<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
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
            'session'=>'canLogin'],
        'group'=>'popup',
        'history'=>false
    ];


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
        $return = static::makeInfoPopup($values,$closure);

        return $return;
    }
}
?>