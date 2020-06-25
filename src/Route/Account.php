<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;

// account
// abstract class for an account route
abstract class Account extends Core\RouteAlias
{
    // config
    protected static array $config = [
        'path'=>[
            'en'=>'my-account',
            'fr'=>'mon-compte'],
        'match'=>[
            'session'=>'canAccess'],
        'sitemap'=>false,
        'group'=>'account'
    ];


    // submitClass
    // retourne la classe pour soumettre
    final public static function submitClass():string
    {
        return AccountSubmit::classOverload();
    }


    // submitRoute
    // retourne la route pour soumettre
    final public function submitRoute():AccountSubmit
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