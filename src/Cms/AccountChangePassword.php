<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Html;
use Quid\Lemur;

// accountChangePassword
// class for the change password route in the CMS
class AccountChangePassword extends Lemur\Route\AccountChangePassword
{
    // trait
    use _modal;


    // config
    public static $config = [
        'match'=>[
            'role'=>['>'=>'user'],
            'ajax'=>true],
        'parent'=>Account::class
    ];


    // canTrigger
    // vérifie si la route peut être lancé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasPermission('accountChangePassword'))? true:false;
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