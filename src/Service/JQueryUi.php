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

// jQueryUi
// class to integrate jquery-ui library
class JQueryUi extends Main\Service
{
    // config
    public static $config = [];


    // docOpenJs
    // retourne le javascript à lier en début de document
    // inclut aussi touchpunch pour que sortable marche avec mobile
    final public function docOpenJs()
    {
        return [2=>'js/vendor/jquery/jquery-ui.js',3=>'js/vendor/jquery/touch-punch.js'];
    }
}

// init
JQueryUi::__init();
?>