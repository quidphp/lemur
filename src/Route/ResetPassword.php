<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Base\Html;
use Quid\Core;

// resetPassword
// abstract class for a reset password route
abstract class ResetPassword extends Core\RouteAlias
{
    // config
    protected static array $config = [
        'path'=>[
            'en'=>'password/reset',
            'fr'=>'mot-de-passe/reinitialisation'],
        'match'=>[
            'role'=>'nobody'],
        'sitemap'=>false,
        'parent'=>Login::class,
        'group'=>'nobody'
    ];


    // canTrigger
    // retourne vrai si la route peut être lancé
    public function canTrigger():bool
    {
        $session = static::session();
        return parent::canTrigger() && $session->roles(false)->isNobody() && $session->user()->allowResetPasswordEmail();
    }


    // submitRoute
    // route pour soumettre le formulaire
    public function submitRoute():ResetPasswordSubmit
    {
        return ResetPasswordSubmit::make();
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
        $lang = static::lang();
        $submit = $lang->text('resetPassword/submit');
        $attr = $this->submitAttr();
        $table = $this->db()->tables()->get('user');
        $submit = Html::submit($submit,$attr);

        $r .= $route->formOpen();
        $field = $table->col('email')->formPlaceholder(null,null,['inputmode'=>'email','data-required'=>true]);
        $fieldHtml = Html::divCond($field,'field');

        $r .= Html::div($fieldHtml,'fields');
        $r .= Html::div($submit,'action');
        $r .= Html::formCl();

        return $r;
    }
}

// init
ResetPassword::__init();
?>