<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;

// login
// abstract class for a login route
abstract class Login extends Core\RouteAlias
{
    // config
    protected static array $config = [
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
    public function canTrigger():bool
    {
        return parent::canTrigger() && static::session()->roles(false)->isNobody();
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