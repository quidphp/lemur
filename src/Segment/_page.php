<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Segment;

// _page
// trait that issues a method to deal with a page route segment (page number)
trait _page
{
    // structureSegmentPage
    // gère le segment d'uri pour une page, doit être un int plus grand que 0
    final public static function structureSegmentPage(string $type,$value,array &$keyValue)
    {
        $return = false;

        if($type === 'make')
        $return = (is_int($value) && $value > 0)? $value:1;

        elseif($type === 'match')
        {
            if(is_scalar($value))
            $return = (is_int($value) && $value > 0)? $value:false;

            else
            $return = 1;
        }

        return $return;
    }
}
?>