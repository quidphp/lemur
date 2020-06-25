<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Service;
use Quid\Main;

// sortable
// class to integrate the sortable javascript library
class Sortable extends Main\Service
{
    // config
    protected static array $config = [];


    // docOpenJs
    // retourne le javascript à lier en début de document
    final public function docOpenJs()
    {
        return 'js/vendor/sortable/sortable.js';
    }
}

// init
Sortable::__init();
?>