<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Service;
use Quid\Main;
use Quid\Routing;

// tinyMce
// class that provides a method to integrate the Tinymce WYSIWYG editor
class TinyMce extends Main\Service
{
    // trait
    use Routing\_service;


    // config
    protected static array $config = [
        'github'=>'https://github.com/tinymce/tinymce',
        'paths'=>[
            'basename'=>'tinymce',
            'serverFrom'=>'[vendor]/tinymce/%basename%',
            'serverTo'=>'[publicJs]/%basename%',
            'public'=>'js/%basename%/tinymce.min.js',
            'extra'=>['[vendorLemur]/service/%basename%/langs'=>'[publicJs]/%basename%/langs']]
    ];


    // docOpenJs
    // retourne le javascript à lier en début de document
    final public function docOpenJs()
    {
        return $this->getPublicPath() ?? null;
    }
}

// init
TinyMce::__init();
?>