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

// login
// abstract class for a login route
abstract class Login extends Core\RouteAlias
{
    // config
    public static $config = [
        'path'=>[
            'en'=>'login',
            'fr'=>'connexion'],
        'priority'=>998,
        'match'=>[
            'role'=>'nobody'],
        'group'=>'nobody'
    ];


    // canTrigger
    // s'assure que le rôle réel (non fake) est bien nobody
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && static::session()->roles(false)->isNobody());
    }


    // submitRoute
    // route pour soumettre le formulaire
    public function submitRoute():LoginSubmit
    {
        return LoginSubmit::make();
    }


    // onReplace
    // comme titre, met le bootLabel
    protected function onReplace(array $return):array
    {
        $return['title'] = $return['bootLabel'];

        return $return;
    }


    // submitAttr
    // attribut pour le bouton submit
    public function submitAttr()
    {
        return;
    }
}

// init
Login::__init();
?>