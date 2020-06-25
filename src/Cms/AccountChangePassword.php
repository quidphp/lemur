<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Lemur;

// accountChangePassword
// class for the change password route in the CMS
class AccountChangePassword extends Lemur\Route\AccountChangePassword
{
    // trait
    use Lemur\Route\_modal;


    // config
    protected static array $config = [
        'match'=>[
            'session'=>'canAccess'],
        'parent'=>Account::class
    ];


    // canTrigger
    // vérifie si la route peut être lancé
    final public function canTrigger():bool
    {
        return parent::canTrigger() && static::session()->isSomebody() && $this->hasPermission('accountChangePassword');
    }


    // submitRoute
    // route à utiliser pour submit
    final public function submitRoute():Lemur\Route\AccountChangePasswordSubmit
    {
        return AccountChangePasswordSubmit::make();
    }


    // submitAttr
    // attribut pour le bouton submit du formulaire
    final public function submitAttr()
    {
        return ['with-icon','modify'];
    }


    // trigger
    // trigge la route accountChangePassword
    final public function trigger():string
    {
        $r = '';

        $r .= Html::h1(static::label());
        $r .= Html::divCond(static::langText('accountChangePassword/info'),'info');
        $r .= Html::divCond($this->makeForm(),'form');

        return $r;
    }
}

// init
AccountChangePassword::__init();
?>