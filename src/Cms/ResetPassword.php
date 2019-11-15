<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base\Html;
use Quid\Lemur;

// resetPassword
// class for the reset password route of the CMS
class ResetPassword extends Lemur\Route\ResetPassword
{
    // trait
    use _nobody;


    // config
    public static $config = [
        'parent'=>Login::class
    ];


    // submitRoute
    // route pour soumettre le formulaire
    final public function submitRoute():Lemur\Route\ResetPasswordSubmit
    {
        return ResetPasswordSubmit::make();
    }


    // submitAttr
    // attribut pour le bouton submit du formulaire
    final public function submitAttr()
    {
        return ['with-icon','reset'];
    }


    // makeForm
    // génère le form de resetPassword
    final protected function makeForm():string
    {
        $r = '';
        $route = $this->submitRoute();
        $r = $route->formOpen();
        $table = $this->db()->tables()->get('user');

        $r .= Html::divOp('top');
        $r .= $table->col('email')->formWrap('divtable','%:',null,['data-required'=>true]);
        $r .= Html::divClose();

        $r .= Html::divCond(static::langText('resetPassword/info'),'info');

        $r .= Html::divOp('bottom');
        $r .= Html::submit(static::label(),$this->submitAttr());
        $r .= Html::divClose();

        $r .= Html::formClose();

        return $r;
    }


    // makeButtons
    // retourne un tableau avec les boutons sous le formulaire de connexion
    final protected function makeButtons():array
    {
        $return = [];
        $return['login'] = $this->makeLogin();
        $return['register'] = $this->makeRegister();

        return $return;
    }
}

// init
ResetPassword::__init();
?>