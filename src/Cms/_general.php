<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
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
    public function table():Core\Table
    {
        $return = $this->segment('table');

        if(is_string($return))
        $return = static::boot()->db()->table($return);

        return $return;
    }


    // general
    // retourne la route general a utilisé pour rediriger
    public function general(bool $nav=true):General
    {
        return static::session()->routeTableGeneral($this->table(),$nav);
    }
}
?>