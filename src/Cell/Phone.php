<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Core;

// phone
// class to manage a cell containing an phone number
class Phone extends Core\CellAlias
{
    // config
    protected static array $config = [];


    // pair
    // retourne le numéro de téléphone formatté, sinon renvoie à parent
    final public function pair($value=null,...$args)
    {
        $return = $this;

        if($value === true)
        $return = $this->get();

        elseif($value !== null)
        $return = parent::pair($value,...$args);

        return $return;
    }
}

// init
Phone::__init();
?>