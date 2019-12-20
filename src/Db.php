<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur;
use Quid\Core;

// db
// extended class used to query the database, adds cms logic
class Db extends Core\Db
{
    // config
    public static $config = [
        'cols'=>[ // paramètre par défaut pour les colonnes
            'featured'=>['class'=>Core\Col\Yes::class,'general'=>true],
            'menu'=>['class'=>Core\Col\Yes::class,'general'=>true],
            'fax'=>['search'=>false],
            'firstName'=>['required'=>true],
            'fullName'=>['general'=>true],
            'lastName'=>['required'=>true],
            'json_en'=>['class'=>Col\JsonArray::class],
            'json_fr'=>['class'=>Col\JsonArray::class],
            'icon'=>['class'=>Col\Media::class,'extension'=>['png','svg']],
            'icons'=>['class'=>Col\Medias::class,'extension'=>['png','svg']],
            'key_en'=>['required'=>true],
            'key_fr'=>['required'=>true],
            'media_fr'=>['class'=>Col\Media::class,'panel'=>'fr'],
            'media_en'=>['class'=>Col\Media::class,'panel'=>'en'],
            'media_id'=>['excerpt'=>null],
            'media_ids'=>['excerpt'=>null],
            'metaImage_fr'=>['class'=>Col\Media::class,'panel'=>'fr','general'=>false,'version'=>['large'=>[80,'jpg','crop',1200,630]],'extension'=>['jpg','png']],
            'metaImage_en'=>['class'=>Col\Media::class,'panel'=>'en','general'=>false,'version'=>['large'=>[80,'jpg','crop',1200,630]],'extension'=>['jpg','png']],
            'name_en'=>['general'=>[Col::class,'generalCurrentLang'],'required'=>true],
            'name_fr'=>['general'=>[Col::class,'generalCurrentLang'],'required'=>true],
            'storage_fr'=>['class'=>Col\Media::class,'panel'=>'fr','path'=>'[storagePrivate]','extension'=>'pdf'],
            'storage_en'=>['class'=>Col\Media::class,'panel'=>'en','path'=>'[storagePrivate]','extension'=>'pdf'],
            'visible'=>['class'=>Core\Col\Yes::class,'general'=>false],
            'background'=>['class'=>Col\Media::class,'extension'=>'jpg'],
            'video'=>['class'=>Col\Media::class,'extension'=>'mp4'],
            'thumbnail'=>['class'=>Col\Media::class,'general'=>true,'extension'=>['jpg','png']],
            'uri_fr'=>['class'=>Core\Col\Uri::class],
            'uri_en'=>['class'=>Core\Col\Uri::class],
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
            'slug'=>['class'=>Col\Slug::class]]
    ];
}

// init
Db::__init();
?>