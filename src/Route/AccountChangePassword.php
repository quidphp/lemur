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
use Quid\Lemur;

// accountChangePassword
// abstract class for an account change password route
abstract class AccountChangePassword extends Core\RouteAlias
{
    // config
    protected static array $config = [
        'path'=>[
            'en'=>'my-account/change-password',
            'fr'=>'mon-compte/mot-de-passe'],
        'match'=>[
            'session'=>'canAccess'],
        'group'=>'submit',
        'parent'=>Account::class,
        'row'=>Lemur\Row\User::class,
        'colPassword'=>'password',
        'sitemap'=>false
    ];


    // submitRoute
    // retourne la route pour soumettre le formulaire
    public function submitRoute():AccountChangePasswordSubmit
    {
        return AccountChangePasswordSubmit::make();
    }


    // submitAttr
    // attribut pour le bouton submit
    public function submitAttr()
    {
        return;
    }


    // makeForm
    // génère le formulaire pour changer le mot de passe
    final protected function makeForm():string
    {
        $r = '';
        $route = $this->submitRoute();
        $lang = static::lang();
        $submit = $lang->text('accountChangePassword/submit');
        $fields = $route->getFields();
        $colPassword = $this->getAttr('colPassword');
        $table = static::tableFromRowClass();
        $col = $table->col($colPassword);

        $r .= $route->formOpen();

        $html = '';
        foreach ($fields as $name)
        {
            $label = $lang->text('accountChangePassword/'.$name);
            $attr = ['name'=>$name,'placeholder'=>$label,'data-required'=>true];
            $form = $col->form(null,$attr);
            $html .= Html::div($form,'field');
        }
        $r .= Html::div($html,'fields');

        $attr = $this->submitAttr();
        $submitHtml = Html::submit($submit,$attr);
        $r .= Html::div($submitHtml,'action');

        $r .= Html::formCl();

        return $r;
    }
}

// init
AccountChangePassword::__init();
?>