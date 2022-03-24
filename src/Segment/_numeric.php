<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;

// _numeric
// trait that issues a method to deal with a simple numeric route segment
trait _numeric
{
    // structureSegmentNumeric
    // gère le segment d'uri pour une simple valeur numérique, très permissif
    final public static function structureSegmentNumeric(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make' && is_numeric($value))
        $return = $value;

        elseif($type === 'match' && is_numeric($value))
        $return = $value;

        return $return;
    }
}
?>