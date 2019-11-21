<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Service;
use Quid\Main;

// polyfill
// class to integrate required React polyfill with set, map and requestAnimationFrame
class Polyfill extends Main\Service
{
    // config
    public static $config = [];


    // docOpenJs
    // retourne le javascript à lier en début de document
    final public function docOpenJs()
    {
        return [0=>'js/vendor/polyfill/polyfill.js'];
    }
}

// init
Polyfill::__init();
?>