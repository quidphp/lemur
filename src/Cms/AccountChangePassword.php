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
        'row'=>Lemur\Row\User::class,
        'parent'=>Account::class
    ];


    // submitRoute
    // route à utiliser pour submit
    public function submitRoute():Lemur\Route\AccountChangePasswordSubmit
    {
        return AccountChangePasswordSubmit::makeOverload();
    }


    // submitAttr
    // attribut pour le bouton submit du formulaire
    public function submitAttr()
    {
        return ['icon','modify','padLeft'];
    }


    // trigger
    // trigge la route accountChangePassword
    public function trigger():string
    {
        $r = '';
        $r .= Html::divtableOpen();
        $r .= Html::h1(static::label());
        $r .= Html::divCond(static::langText('accountChangePassword/info'),'info');
        $r .= Html::divCond($this->makeForm(),'form');
        $r .= Html::divtableClose();

        return $r;
    }


    // aDialog
    // retourne le lien dialog pour ouvrir la formulaire dans une box
    public function aDialog($attr=null):string
    {
        return $this->a(static::langText('accountChangePassword/link'),Base\Attr::append($attr,['data'=>['modal'=>static::name()]]));
    }
}

// init
AccountChangePassword::__init();
?>