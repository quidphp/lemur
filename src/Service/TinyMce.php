<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Service;
use Quid\Main;

// tinyMce
// class that provides a method to integrate tinyMce WYSIWYG editor
class TinyMce extends Main\Service
{
    // config
    public static $config = [];


    // docOpenJs
    // retourne le javascript à lier en début de document
    final public function docOpenJs()
    {
        return 'js/vendor/tinymce/tinymce.min.js';
    }
}

// init
TinyMce::__init();
?>