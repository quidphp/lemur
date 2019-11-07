<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cell;
use Quid\Core;

// media
// class to work with a cell containing a value which is a link to a file
class Media extends Core\Cell\Media
{
    // config
    public static $config = [];


    // generalOutput
    // génère le output pour général
    final public function generalOutput(?array $option=null):string
    {
        return $this->commonGeneralOutput(null,$option);
    }
}

// init
Media::__init();
?>