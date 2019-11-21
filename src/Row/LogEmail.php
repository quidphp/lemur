<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Row;
use Quid\Core;
use Quid\Lemur;

// logEmail
// class to represent a row of the logEmail table, with cms logic
class LogEmail extends Core\Row\LogEmail
{
    // config
    public static $config = [
        'cols'=>[
            'json'=>['class'=>Lemur\Col\JsonExport::class]],
        'permission'=>[
            'contributor'=>['update'=>false,'delete'=>false],
            'editor'=>['update'=>false,'delete'=>false],
            'subAdmin'=>['update'=>false]],
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'subAdmin'=>['lemurInsert'=>false],
                'admin'=>['lemurInsert'=>false,'lemurTruncate'=>true]]]
    ];
}

// init
LogEmail::__init();
?>