<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Route;
use Quid\Core;

// _specificPointer
// trait that grants methods to deal with a specific resource represent by a pointer (table/id)
trait _specificPointer
{
    // canTrigger
    // si la route peut être lancé
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasPointer() && $this->pointer()->isVisible();
    }


    // hasPointer
    // retourne vrai si le pointeur existe
    final protected function hasPointer():bool
    {
        return $this->segment('pointer') instanceof Core\Row;
    }


    // pointer
    // retourne la ligne de pointeur
    final protected function pointer():Core\Row
    {
        return $this->segment('pointer');
    }


    // pointerRoute
    // retourne la route de la ligne du pointeur
    final protected function pointerRoute():Core\Route
    {
        return $this->pointer()->route();
    }
}
?>