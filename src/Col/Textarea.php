<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;
use Quid\Orm;

// textarea
// class for a column which is editable through a textarea input
class Textarea extends Core\ColAlias
{
    // config
    public static $config = [
        'tag'=>'textarea',
        'search'=>true,
        'check'=>['kind'=>'text'],
        'relative'=>null, // custom, type pour absoluteReplace, utilise ceci pour ramener les liens absoluts dans leur version relative
        '@cms'=>[
            'route'=>['tableRelation'=>Lemur\Cms\SpecificTableRelation::class]]
    ];


    // onSet
    // gère la logique onSet pour textarea
    // la seule chose géré est le remplacement des liens absoluts pour leur version relatives
    public function onSet($return,array $row,?Orm\Cell $cell=null,array $option)
    {
        $return = parent::onSet($return,$row,$cell,$option);

        if(is_string($return))
        $return = $this->absoluteReplace($return);

        return $return;
    }


    // absoluteReplace
    // remplacement des liens absoluts vers relatifs dans le bloc texte
    protected function absoluteReplace(string $return):string
    {
        $relative = $this->attr('relative');

        if(!empty($relative))
        {
            $relative = (array) $relative;
            $boot = static::boot();
            $replace = [];

            foreach ($relative as $type)
            {
                foreach ($boot->schemeHostEnvs($type) as $schemeHost)
                {
                    $schemeHost .= '/';
                    $replace[$schemeHost] = '/';
                }
            }

            if(!empty($replace))
            $return = Base\Str::replace($replace,$return);
        }

        return $return;
    }


    // hasTableRelation
    // retourne vrai si le textarea a des table relation
    public function hasTableRelation():bool
    {
        $return = false;
        $table = $this->table();
        $relations = $this->attr('tableRelation');

        if(is_array($relations) && !empty($relations) && $table->hasPermission('relation','tableRelation'))
        $return = true;

        return $return;
    }


    // getDataAttr
    // retourne les datas attr pour la colonne
    public function getDataAttr(array $return):array
    {
        if($this->hasTableRelation())
        $return['table-relation'] = true;

        return $return;
    }


    // formComplex
    // génère le formComplex pour tinymce, avec une box relation
    public function formComplex($value=true,?array $attr=null,?array $option=null):string
    {
        $tag = $this->tag($attr);
        $return = parent::formComplex($value,$attr,$option);

        if($this->hasTableRelation() && Html::isFormTag($tag,true))
        {
            $relations = $this->attr('tableRelation');
            $tables = $this->db()->tables();
            $tables = $tables->gets(...array_values($relations));

            if($tables->isNotEmpty())
            $return .= Html::divCond($this->relationBox($tables),'relations');
        }

        return $return;
    }


    // relationBox
    // génère la box relation pour le champ wysiwyg
    public function relationBox(Orm\Tables $tables):string
    {
        $r = '';

        foreach ($tables as $table)
        {
            $route = $this->route('tableRelation',['table'=>$table]);
            $r .= $route::makeClickOpen($table,$route,['click-open','filter','anchor-corner']);
        }

        return $r;
    }
}

// init
Textarea::__init();
?>