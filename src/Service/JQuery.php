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

// jQuery
// class to integrate jquery library
class JQuery extends Main\Service
{
    // config
    public static $config = [];


    // docOpenJs
    // retourne le javascript à lier en début de document
    final public function docOpenJs()
    {
        return [1=>'js/vendor/jquery/jquery.js'];
    }
}

// init
JQuery::__init();
?>