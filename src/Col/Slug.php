<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Core;
use Quid\Orm;

// slug
// class for a column dealing with an URI slug
class Slug extends Core\ColAlias
{
    // config
    protected static array $config = [
        'tag'=>'inputText',
        'setPriority'=>9,
        'keyboard'=>'url',
        'validate'=>['slug'],
        'include'=>true,
        'visible'=>['validate'=>'notEmpty'],
        'duplicate'=>false,
        'required'=>true,
        'check'=>['kind'=>'char'],
        'slug'=>['date'=>'date','dateStart'=>'date','datetimeStart'=>'date','dateAdd'=>'date'], // custom, colonnes de date
        'slugDate'=>['ymd','compact'], // format de date
        'slugKey'=>'name', // nom de la cellule pour générer la base de slug, le code de langue est ajouté _
        'slugChangeTablesCols'=>null, // tableau contenant les tables et colonnes ou faire le replace lors d'un changement de slug
        'slugChangeUri'=>'%lang%/%slug%', // définit le pattern de l'uri à chercher et remplace, %lang% et %slug% sont remplacés
        'onSlugChange'=>null // callback alternatif si le slug a changé
    ];


    // replaceMode
    protected static array $replaceMode = ['=slug']; // défini les colonnes à ne pas merger récursivement


    // slugExists
    // méthode appelé lorsque le slug retourné existe déjà
    final protected function slugExists(string $return,array $row,?Core\Cell $cell,array $option):string
    {
        $slug = $this->slugAttr(true);
        $keep = $return;

        if(is_array($slug) && !empty($slug) && !static::isCallable($slug))
        {
            foreach ($slug as $v => $type)
            {
                if(array_key_exists($v,$row))
                {
                    if($type === 'date')
                    $x = $this->slugDateConvert($v,$row[$v]);

                    else
                    $x = Base\Str::cast($row[$v]);

                    if(is_string($x) && strlen($x))
                    {
                        $return = $this->slugAdd($return,$x,$option);
                        break;
                    }
                }
            }
        }

        if(!$this->slugUnique($return,$cell,true))
        $return = $this->slugAddNow($keep,$cell,$option);

        return $return;
    }


    // onSet
    // gère la logique set pour slug
    // génère le slug à partir de name_[lang] si vide
    final protected function onSet($return,?Orm\Cell $cell,array $row,array $option)
    {
        if($this->slugDo($return,$cell))
        {
            $slug = $this->slugAttr();

            if(static::isCallable($slug))
            $return = $slug($this,$row,$cell,$option);

            else
            {
                $name = $this->slugKeyFromArr($row);

                if(!empty($name))
                {
                    $option = ['totalLength'=>$this->length()];
                    $return = static::slugMake($name,$option);
                }
            }

            if(!empty($return))
            {
                $unique = $this->slugUnique($return,$cell,true);

                if($unique !== true)
                $return = $this->slugExists($return,$row,$cell,$option);
            }
        }

        if(!empty($cell) && is_string($return))
        $this->slugHasChanged($return,$cell,$option);

        return $return;
    }


    // slugHasChanged
    // gère l'appel au callback si le slug a changé
    final protected function slugHasChanged(string $return,Core\Cell $cell,array $option):void
    {
        $option = Base\Arr::plus(['com'=>false],$option);
        $old = $cell->value();
        if(is_string($old) && $return !== $old)
        {
            $onChange = $this->getAttr('onSlugChange');
            if(!empty($onChange))
            $replaced = $onChange($return,$old,$cell,$option);

            else
            $replaced = $this->slugOnChangeReplace($return,$old,$cell,$option);

            if(is_int($replaced) && $replaced > 0 && $option['com'] === true)
            {
                $lang = $this->db()->lang();
                $text = $lang->plural($replaced,'com/pos/slug/updated',['count'=>$replaced]);
                $this->com($text,$cell,'pos');
            }
        }
    }


    // slugOnChangeReplace
    // permet de faire le changement de slug dans un ou plusieurs champs d'une ou plusieurs tables
    final protected function slugOnChangeReplace(string $to,string $from,Core\Cell $cell,array $option):int
    {
        $return = 0;
        $tablesCols = $this->getAttr('slugChangeTablesCols');
        $uri = $this->getAttr('slugChangeUri');
        $langCode = $this->schema()->nameLangCode();

        if(is_array($tablesCols) && !empty($tablesCols) && is_string($uri) && !empty($uri) && is_string($langCode))
        {
            $db = static::boot()->db();
            $tablesCols = $this->getAttr('slugChangeTablesCols');
            $from = $this->slugOnChangeMake($from,$uri,$langCode);
            $to = $this->slugOnChangeMake($to,$uri,$langCode);

            foreach ($tablesCols as $table => $cols)
            {
                $cols = (array) $cols;

                if($db->hasTable($table) && !empty($cols))
                {
                    $table = $db->table($table);

                    foreach ($cols as $col)
                    {
                        if($table->hasCol($col))
                        {
                            $col = $table->col($col);
                            $replaced = $col->replace($from,$to);

                            if(is_int($replaced))
                            $return += $replaced;
                        }
                    }
                }
            }
        }

        return $return;
    }


    // slugOnChangeMake
    // génère le chemin à remplacer lors d'un changement de slug
    final protected function slugOnChangeMake(string $return,string $uri,string $langCode):string
    {
        $return = Base\Str::replace(['%lang%'=>$langCode,'%slug%'=>$return],$uri);
        $return = Base\Path::wrapStart($return);
        $return = Base\Str::quote($return,true);

        return $return;
    }


    // slugDateConvert
    // permet de convertir une date de row dans le format contenu dans slugDateFirst
    final public function slugDateConvert(string $col,$value):?string
    {
        $return = null;
        $method = $this->slugDateFirst();

        if(is_string($method) && is_scalar($value))
        {
            if(is_string($value))
            {
                $table = $this->table();
                $col = $table->col($col);
                $format = $col->date();

                if(is_string($format))
                $value = Base\Datetime::time($value,$format);
            }

            if(is_int($value))
            $return = Base\Datetime::$method($value);
        }

        return $return;
    }


    // slugAttr
    // retourne les attributs pour slug
    final public function slugAttr(bool $array=false)
    {
        $return = $this->getAttr('slug');

        if($array === true && !is_array($return))
        $return = self::$config['slug'];

        return $return;
    }


    // slugDo
    // détermine s'il faut générer un nouveau slug
    final public function slugDo($value,?Core\Cell $cell=null):bool
    {
        $return = false;

        if(empty($value) || !is_string($value))
        $return = true;

        if(is_string($value) && $this->slugUnique($value,$cell,true) !== true)
        $return = true;

        return $return;
    }


    // slugUnique
    // retourne vrai si le slug est unique
    // par défaut va toujours retourner vrai si le schema n'indique pas que la colonne est unique
    final public function slugUnique($value,?Core\Cell $cell=null,bool $colSchema=true):bool
    {
        $return = false;
        $notIn = null;

        if($colSchema === true && !$this->shouldBeUnique())
        $return = true;

        else
        {
            if(!empty($cell))
            $notIn = $cell->rowPrimary();

            $return = ($this->isUnique($value,$notIn));
        }

        return $return;
    }


    // slugKeyFromArr
    // retourne le champ a utilisé pour slug à partir du tableau row
    final public function slugKeyFromArr(array $row):?string
    {
        $return = null;
        $lang = $this->schema()->nameLangCode();
        $key = $this->getAttr('slugKey');

        if(is_string($key))
        {
            if(is_string($lang))
            $return = Base\Lang::arr($key,$row,$lang);

            if(empty($return) && array_key_exists($key,$row))
            $return = $row[$key];
        }

        return $return;
    }


    // slugAddNow
    // ajoute la date courante au slug
    // essaie via deux formats, ymd et ymdhist
    final public function slugAddNow($value,?Core\Cell $cell=null,?array $option=null):string
    {
        $return = null;
        $keep = $value;
        $unique = false;
        $dates = $this->getAttr('slugDate');

        if(!is_string($value))
        $value = static::slugMake($value,$option);

        if(is_array($dates) && !empty($dates))
        {
            foreach ($dates as $method)
            {
                if(is_string($method))
                {
                    $now = Base\Datetime::$method();

                    if(is_string($now))
                    {
                        $return = $this->slugAdd($value,$now,$option);

                        if($this->slugUnique($return,$cell,true) === true)
                        {
                            $unique = true;
                            break;
                        }
                    }
                }
            }
        }

        if($unique === false)
        $return = $this->slugAdd($value,Base\Str::random(15),$option);

        return $return;
    }


    // slugDateFirst
    // retourne la première méthode dans slugDate
    final public function slugDateFirst():string
    {
        $return = null;
        $dates = $this->getAttr('slugDate');

        if(is_array($dates) && !empty($dates))
        $return = current($dates);

        return $return;
    }


    // slugAdd
    // ajoute un élément à la fin du slug
    final public function slugAdd(string $return,string $add,?array $option=null):string
    {
        if(strlen($return) && strlen($add))
        {
            $length = $this->length();
            $return .= '-'.$add;

            if(strlen($return) > $length)
            $return = substr($return,-$length);
        }

        return $return;
    }


    // slugMake
    // gère l'appel à la classe base/slugPath
    public static function slugMake($value,?array $option=null):string
    {
        return Base\Slug::str($value,$option);
    }
}

// init
Slug::__init();
?>