<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;

// home
// abstract class for a home route
abstract class Home extends Core\RouteAlias
{
    // config
    public static $config = [
        'path'=>'',
        'group'=>'home',
        'priority'=>1
    ];


    // onReplace
    // comme titre, met le bootLabel
    protected function onReplace(array $return):array
    {
        $return['title'] = $return['bootLabel'];

        return $return;
    }
}

// init
Home::__init();
?>