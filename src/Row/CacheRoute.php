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

// cacheRoute
// class to store rendered route caches, with cms config
class CacheRoute extends Core\Row\CacheRoute
{
    // config
    protected static array $config = [
        'cacheEmpty'=>false,
        'cols'=>[
            'context'=>['class'=>Lemur\Col\JsonExport::class,'general'=>true],
            'data'=>['class'=>Lemur\Col\JsonExport::class]],
        '@cms'=>[
            'permission'=>[
                '*'=>['homeFeed'=>false,'truncate'=>true],
                'contributor'=>['view'=>false,'lemurDelete'=>false],
                'editor'=>['view'=>false,'lemurDelete'=>false],
                'subAdmin'=>['lemurInsert'=>false,'lemurDelete'=>false],
                'admin'=>['lemurInsert'=>false,'lemurTruncate'=>true]]]
    ];
}

// init
CacheRoute::__init();
?>