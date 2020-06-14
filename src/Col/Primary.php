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

// primary
// extended class for dealing with a column which has an auto increment primary key
class Primary extends Core\Col\Primary
{
    // config
    protected static array $config = [];


    // getDataAttr
    // retourne les attr pour la colonne primaire
    public function getDataAttr(array $return):array
    {
        $table = $this->table();
        $specific = $table->hasPermission('view','specific');
        $return['data-link'] = $specific;

        return $return;
    }
}

// init
Primary::__init();
?>