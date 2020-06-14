<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cell;
use Quid\Base;
use Quid\Core;

// media
// class to work with a cell containing a value which is a link to a file
class Media extends Core\Cell\Media
{
    // config
    protected static array $config = [];


    // generalOutput
    // génère le output pour général
    final public function generalOutput(array $option):string
    {
        return $this->commonGeneralOutput(null,$option);
    }


    // outputTableRelation
    // génère le output tableRelation pour media
    final public function outputTableRelation():array
    {
        return Base\Arr::clean([$this->commonTableRelationOutput()]);
    }
}

// init
Media::__init();
?>