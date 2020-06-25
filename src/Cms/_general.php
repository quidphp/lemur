<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// _general
// trait that provides commonly used methods related to the general navigation route of the CMS
trait _general
{
    // table
    // retourne la table en lien avec la route
    final public function table():Core\Table
    {
        $return = $this->segment('table');

        if(is_string($return))
        $return = static::boot()->db()->table($return);

        return $return;
    }


    // hasTable
    // retouren vrai si la route est lié à une table
    final public function hasTable():bool
    {
        return $this->segment('table') instanceof Core\Table;
    }


    // general
    // retourne la route general a utilisé pour rediriger
    final public function general(bool $nav=true):General
    {
        return static::session()->routeTableGeneral($this->table(),$nav);
    }
}
?>