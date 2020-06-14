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
use Quid\Base\Html;
use Quid\Core;

// uri
// class to manage a cell containing an URI
class Uri extends Core\CellAlias
{
    // config
    protected static array $config = [];


    // generalOutput
    // génère le output général pour une cellule contenant une uri
    public function generalOutput(array $option):?string
    {
        return $this->anchor($option['excerpt'] ?? null);
    }


    // anchor
    // génère le anchor pour un uri
    final public function anchor(?int $excerpt=null):?string
    {
        $return = $this->get();
        $excerpt ??= 30;

        if(is_string($return))
        {
            $title = (!empty($excerpt))? Base\Str::excerpt($excerpt,$return):true;
            $return = Html::a($return,$title);
        }

        return $return;
    }
}

// init
Uri::__init();
?>