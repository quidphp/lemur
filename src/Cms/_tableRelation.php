<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Base\Html;
use Quid\Orm;

// _tableRelation
// trait that provides methods for a table relation selector
trait _tableRelation
{
    // trait
    use _relation;


    // isSearchValueValid
    // retourne vrai si la valeur de recherche est valide
    final protected function isSearchValueValid(string $value):bool
    {
        return $this->table()->isSearchTermValid($value);
    }


    // relation
    // retourne l'objet relation de la table
    final public function relation():Orm\Relation
    {
        return $this->table()->relation();
    }


    // relationKeyValue
    // retourne les keyValue à partir de valeur de relation
    final protected function relationKeyValue(array $values):?array
    {
        $return = null;
        $table = $this->table();
        $return = $table->relation()->gets($values,true,false);

        return $return;
    }


    // trigger
    // lance la route tableRelation
    final public function trigger():string
    {
        $r = '';
        $grab = $this->relationGrab();

        if(!empty($grab))
        {
            ['result'=>$results,'count'=>$count] = $grab;

            if(is_array($results) && !empty($results))
            $r .= $this->makeResults($results,null,$count);
        }

        if(empty($r))
        $r .= Html::h3(static::langText('common/nothing'));

        return $r;
    }


    // makeTableRelation
    // génère le html pour le clickOpen
    final public function makeTableRelation(?string $label=null,?string $after=null,$attr=null):string
    {
        $r = '';
        $table = $this->table();
        $relation = $this->relation();
        $label ??= $table->label();
        $title = Html::span($label,['title','data-title'=>$label]);
        $title .= Html::span(null,'ico');

        [$html,$data] = static::commonInsideClickOpen($relation,$this);
        $attr = Base\Attr::append($attr,['data'=>$data]);
        $r .= static::makeClickOpen($html,$title,$after,$attr);

        return $r;
    }
}
?>