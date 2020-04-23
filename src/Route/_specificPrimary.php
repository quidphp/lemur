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

// _specificPrimary
// trait that provides most methods used for a specific route using a primary segment
trait _specificPrimary
{
    // canTrigger
    // si la route peut être lancé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->row()->isVisible());
    }


    // rowExists
    // retourne vrai si la row existe
    final public function rowExists():bool
    {
        return ($this->segment('primary') instanceof Core\Row);
    }


    // row
    // retourne la row pour specific
    final public function row():Core\Row
    {
        return $this->segment('primary');
    }
}
?>