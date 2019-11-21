<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Col;
use Quid\Core;

// contextType
// class for the contextType column, a checkbox set relation with all boot types
class ContextType extends Core\Col\ContextType
{
    // config
    public static $config = [
        'sortable'=>false
    ];
}

// init
ContextType::__init();
?>