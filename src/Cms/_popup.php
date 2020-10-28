<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;

// _popup
// trait that provides some initial configuration for a CMS popup route
trait _popup
{
    // trait
    use _common;


    // config
    protected static array $configPopup = [
        'match'=>[
            'ajax'=>true,
            'session'=>'canAccess'],
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
        $values = $this->getAttr('popup') ?? [];
        $values = Base\Arr::keysSort($values);
        $closure = $this->popupClosure();
        $return = static::makeInfoPopup($values,$closure);

        return $return;
    }
}
?>