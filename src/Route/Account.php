<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Route;
use Quid\Core;

// account
// abstract class for an account route
abstract class Account extends Core\RouteAlias
{
    // config
    public static $config = [
        'path'=>[
            'en'=>'my-account',
            'fr'=>'mon-compte'],
        'match'=>[
            'role'=>['>='=>'user']],
        'sitemap'=>false,
        'group'=>'account'
    ];


    // submitClass
    // retourne la classe pour soumettre
    final public static function submitClass():string
    {
        return AccountSubmit::getOverloadClass();
    }


    // submitRoute
    // retourne la route pour soumettre
    final public function submitRoute():AccountSubmit
    {
        return static::submitClass()::make();
    }


    // submitAttr
    // retourne les attributs pour le bouton submit
    final public function submitAttr()
    {
        return;
    }


    // getBaseFields
    // retourne les champs du formulaire
    final public function getBaseFields():array
    {
        return $this->submitRoute()->getBaseFields();
    }


    // row
    // retourne la row user
    final public function row():Core\Row
    {
        return static::session()->user();
    }
}

// init
Account::__init();
?>