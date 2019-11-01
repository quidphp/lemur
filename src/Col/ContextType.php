<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/core/blob/master/LICENSE
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