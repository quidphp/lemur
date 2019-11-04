<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Row;
use Quid\Core;
use Quid\Lemur;

// logHttp
// class to represent a row of the logHttp table, with cms logic
class LogHttp extends Core\Row\LogHttp
{
    // config
    public static $config = [
        'cols'=>[
            'json'=>['class'=>Lemur\Col\JsonExport::class]],
        'permission'=>array(
            'shared'=>['insert'=>true],
            'user'=>['insert'=>true],
            'contributor'=>['insert'=>true,'update'=>false,'delete'=>false],
            'editor'=>['insert'=>true,'update'=>false,'delete'=>false],
            'subAdmin'=>['update'=>false]),
        '@cms'=>[
            'permission'=>[
                'contributor'=>['view'=>false],
                'editor'=>['view'=>false],
                'subAdmin'=>['lemurInsert'=>false],
                'admin'=>['lemurInsert'=>false,'lemurTruncate'=>true]]]
    ];
}

// init
LogHttp::__init();
?>