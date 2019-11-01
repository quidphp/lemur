<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Core;

// relation
// abstract class extended by the enum and set cells
class Relation extends Core\Cell\Relation
{
    // config
    public static $config = [];


    // generalOutput
    // génère le output pour général
    public function generalOutput(?array $option=null):?string
    {
        $return = null;
        $relation = $this->relationKeyValue();

        if(!empty($relation))
        {
            $col = $this->col();
            $max = $col->getAttr('generalMax');
            $total = count($relation);
            $separator = ', ';
            $array = $col->prepareRelationPlainGeneral($relation);

            if(!empty($array))
            {
                $return = implode($separator,$array);

                if($total > $max)
                {
                    $diff = ($total - $max);
                    $return .= " (+$diff)";
                }
            }
        }

        return $return;
    }
}

// init
Relation::__init();
?>