<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Col;
use Quid\Base\Html;
use Quid\Core;
use Quid\Lemur;

// textarea
// extended class for a column which is editable through a textarea input
class Textarea extends Core\Col\Textarea
{
    // config
    public static $config = [
        '@cms'=>[
            'route'=>['tableRelation'=>Lemur\Cms\SpecificTableRelation::class]]
    ];


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


    // classHtml
    // retourne la classe additionnelle à utiliser
    public function classHtml():array
    {
        $return = [parent::classHtml()];

        if($this->hasTableRelation())
        $return[] = 'table-relation';

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
    public function relationBox(Core\Tables $tables):string
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