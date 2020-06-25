<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Core;

// contextType
// class for the contextType column, a checkbox set relation with all boot types
class ContextType extends Core\Col\ContextType
{
    // config
    protected static array $config = [
        'sortable'=>false
    ];
}

// init
ContextType::__init();
?>