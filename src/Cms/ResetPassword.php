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

// resetPassword
// class for the reset password route of the CMS
class ResetPassword extends Lemur\Route\ResetPassword
{
    // trait
    use _nobody;


    // config
    protected static array $config = [
        'parent'=>Login::class
    ];


    // canTrigger
    // retourne vrai si la route peut être lancé
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPermission('resetPassword');
    }


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


    // makeInfo
    // retourne le message d'information
    final protected function makeInfo():string
    {
        return static::langText('resetPassword/info');
    }


    // makeForm
    // génère le form de resetPassword
    final protected function makeForm():string
    {
        $r = '';
        $route = $this->submitRoute();
        $table = $this->db()->tables()->get('user');
        $submit = Html::submit(static::label(),$this->submitAttr());
        $colHtml = $table->col('email')->formWrap('divtable','%:',null,['data-required'=>true]);

        $r .= $route->formOpen();
        $r .= Html::div($colHtml,'top');
        $r .= Html::div($submit,'bottom');
        $r .= Html::formCl();

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