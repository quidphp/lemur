<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur;
use Quid\Core;
use Quid\Main;

// row
// extended class to represent a row within a table, adds cms config
class Row extends Core\Row implements Main\Contract\Meta
{
    // trait
    use Row\_meta;


    // config
    protected static array $config = [];


    // getDataAttr
    // retourne les attr pour la ligne
    public function getDataAttr(array $return):array
    {
        return $return;
    }


    // getViewRouteType
    // retourne le type à utiliser pour voir la route via la page spécifique du cms
    public function getViewRouteType():?string
    {
        return null;
    }
}
?>