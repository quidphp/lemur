<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;
use Quid\Lemur;

// lang
// class to work with a row of the lang table, with cms config
class Lang extends Core\Row\Lang
{
    // config
    protected static array $config = [
        'cols'=>[
            'content_fr'=>['class'=>Lemur\Col\Textarea::class],
            'content_en'=>['class'=>Lemur\Col\Textarea::class]],
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>true,'insert'=>false,'delete'=>false]]]
    ];
}

// init
Lang::__init();
?>