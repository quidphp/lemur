<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// db
// extended class used to query the database, adds cms logic
class Db extends Core\Db
{
    // config
    public static $config = [
        'option'=>[
            'cols'=>[ // paramètre par défaut pour les colonnes
                'content_en'=>['class'=>Col\TinyMce::class],
                'content_fr'=>['class'=>Col\TinyMce::class],
                'content'=>['class'=>Col\TinyMce::class],
                'excerpt_en'=>['class'=>Col\Excerpt::class],
                'excerpt_fr'=>['class'=>Col\Excerpt::class],
                'metaSearch_fr'=>['class'=>Col\Auto::class],
                'metaSearch_en'=>['class'=>Col\Auto::class],
                'phone'=>['class'=>Col\Phone::class,'search'=>false],
                'slug_en'=>['class'=>Col\Slug::class],
                'slug_fr'=>['class'=>Col\Slug::class],
                'slugPath_en'=>['class'=>Col\SlugPath::class],
                'slugPath_fr'=>['class'=>Col\SlugPath::class],
                'fragment_en'=>['class'=>Col\Fragment::class],
                'fragment_fr'=>['class'=>Col\Fragment::class],
                'slug'=>['class'=>Col\Slug::class]]]
    ];
}

// init
Db::__init();
?>