<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// session
// extended class for the session with methods related to the CMS
class Session extends Core\Session
{
    // config
    protected static array $config = [
        '@cms'=>[
            'loginLifetimeCom'=>true] // s'il faut afficher la communication de déconnexion à cause du lifetime
    ];


    // routeTableGeneral
    // retourne une route general à partir d'un objet table
    // la session peut générer la route à partir de la dernière route de la même table conservé dans l'objet nav de session
    final public function routeTableGeneral(Core\Table $table,bool $nav=true,string $segment='table',string $key='general'):Route
    {
        $return = null;
        $routeClass = $table->routeClass($key,true);

        if($nav === true)
        {
            $nav = $this->nav();
            $return = $nav->route([$routeClass,$table]);
        }

        if(empty($return) || !$return->isValidSegment())
        {
            $segments = [$segment=>$table];
            $return = $routeClass::make($segments)->checkValidSegment();
        }

        return $return;
    }
}

// init
Session::__init();
?>