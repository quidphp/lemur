<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
            'fr'=>'mon-compte',
            'en'=>'my-account'],
        'match'=>[
            'role'=>['>='=>20]],
        'sitemap'=>false
    ];


    // submitClass
    // retourne la classe pour soumettre
    public static function submitClass():string
    {
        return AccountSubmit::getOverloadClass();
    }


    // submitRoute
    // retourne la route pour soumettre
    public function submitRoute():AccountSubmit
    {
        return static::submitClass()::make();
    }


    // submitAttr
    // retourne les attributs pour le bouton submit
    public function submitAttr()
    {
        return;
    }


    // getBaseFields
    // retourne les champs du formulaire
    public static function getBaseFields():array
    {
        return static::submitClass()::getBaseFields();
    }


    // row
    // retourne la row user
    public function row():Core\Row
    {
        return static::session()->user();
    }
}

// init
Account::__init();
?>