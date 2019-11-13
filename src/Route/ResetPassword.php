<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// resetPassword
// abstract class for a reset password route
abstract class ResetPassword extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_nobody;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'mot-de-passe/reinitialisation',
            'en'=>'password/reset'],
        'match'=>[
            'role'=>'nobody',
            'session'=>'allowResetPasswordEmail'],
        'sitemap'=>false,
        'parent'=>Login::class,
        'group'=>'nobody'
    ];


    // submitRoute
    // route pour soumettre le formulaire
    abstract public function submitRoute():ResetPasswordSubmit;


    // canTrigger
    // retourne vrai si la route peut être lancé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && static::session()->roles(false)->isNobody() && static::session()->allowResetPasswordEmail())? true:false;
    }


    // submitAttr
    // attribut pour le bouton submit
    public function submitAttr()
    {
        return;
    }


    // makeForm
    // génère le formulaire pour réinitialiser le mot de passe
    protected function makeForm():string
    {
        $r = '';
        $route = $this->submitRoute();
        $submit = static::langText('resetPassword/submit');
        $attr = $this->submitAttr();

        $r .= $route->formOpen();
        $field = $this->db()->tables()->get('user')->col('email')->formPlaceholder(null,null,['data-required'=>true]);

        $r .= Html::divOp('fields');
        $r .= Html::divCond($field,'field');
        $r .= Html::divCl();

        $r .= Html::divOp('action');
        $r .= Html::submit($submit,$attr);
        $r .= Html::divCl();

        $r .= Html::formClose();

        return $r;
    }
}

// init
ResetPassword::__init();
?>