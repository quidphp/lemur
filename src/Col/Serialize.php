<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Core;
use Quid\Orm;

// serialize
// extended class for a column which should serialize its value
class Serialize extends Core\Col\Serialize
{
    // config
    protected static array $config = [
        'complex'=>'div'
    ];


    // specificComplexOutput
    // utilisé pour le output de serialize pour formComplex
    final public function specificComplexOutput($return,?Orm\Cell $cell=null,array $option)
    {
        return Base\Debug::export($return);
    }
}

// init
Serialize::__init();
?>