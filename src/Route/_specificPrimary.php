<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;

// _specificPrimary
// trait that provides most methods used for a specific route using a primary segment
trait _specificPrimary
{
    // onBefore
    // avant le lancement de la route
    final protected function onBefore()
    {
        return $this->row()->isVisible();
    }


    // rowExists
    // retourne vrai si la row existe
    final public function rowExists():bool
    {
        return ($this->segment('primary') instanceof Core\Row)? true:false;
    }


    // row
    // retourne la row pour specific
    final public function row():Core\Row
    {
        return $this->segment('primary');
    }
}
?>