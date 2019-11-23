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
use Quid\Core;
use Quid\Lemur;
use Quid\Orm;

// TableRelation
// class for the route which manages table relation, used by some inputs in the CMS
class TableRelation extends Core\RouteAlias
{
    // trait
    use _relation;
    use Lemur\Route\_relation;
    use Lemur\Segment\_table;
    use Lemur\Segment\_orderTableRelation;
    use Lemur\Segment\_page;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/relation/[table]/[order]/[page]',
            'fr'=>'table/relation/[table]/[order]/[page]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'order'=>'structureSegmentOrderTableRelation',
            'page'=>'structureSegmentPage'],
        'method'=>'tableRelationOutput'
    ];


    // canTrigger
    // validation pour le lancement de la route
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->segment('table');

        if(parent::canTrigger() && $table instanceof Core\Table && $table->hasPermission('view','relation','tableRelation'))
        $return = true;

        return $return;
    }


    // relation
    // retourne l'objet relation de la table
    final public function relation():Orm\Relation
    {
        return $this->segment('table')->relation();
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


    // isSearchValueValid
    // retourne vrai si la valeur de recherche est valide
    final protected function isSearchValueValid(string $value):bool
    {
        return ($this->segment('table')->isSearchTermValid($value))? true:false;
    }


    // relationKeyValue
    // retourne les keyValue à partir de valeur de relation
    final protected function relationKeyValue(array $values):?array
    {
        $return = null;
        $table = $this->segment('table');
        $return = $table->relation()->gets($values,true,false);

        return $return;
    }


    // makeResults
    // génère les résultats d'affichage de la relation
    final protected function makeResults(array $array,$attr=null,?int $loadMore=nul):string
    {
        $r = '';

        if(!empty($array))
        {
            foreach ($array as $key => $value)
            {
                $r .= Html::li($value);
            }

            if(!empty($r) && is_int($loadMore))
            $r .= $this->loadMore($loadMore);

            $r = Html::ulCond($r,$attr);
        }

        return $r;
    }


    // makeTableRelation
    // génère le html pour le clickOpen
    final public static function makeTableRelation(Core\Table $table,Core\Route $route,$attr=null):string
    {
        $r = '';
        $html = '';
        $relation = $table->relation();
        $size = $relation->size();
        $title = Html::span($table->label(),'title');
        $title .= Html::span(null,'ico');
        $after = null;

        $limit = $route->limit();
        $query = $route->getSearchQuery();
        $data = ['query'=>$query,'separator'=>static::getDefaultSegment(),'char'=>static::getReplaceSegment()];
        if($route->hasOrder())
        $route = $route->changeSegment('order',true);
        $data['href'] = $route;

        if($size > $limit)
        {
            $searchMinLength = $table->searchMinLength();
            $order = $route->orderSelect();

            $html .= Html::divOp('top');
            $placeholder = static::langText('common/filter')." ($size)";
            $html .= Html::inputText(null,['name'=>true,'data-pattern'=>['minLength'=>$searchMinLength],'placeholder'=>$placeholder]);

            if(!empty($order))
            {
                $html .= Html::div(null,'spacing');
                $html .= $order;
            }

            $html .= Html::divCl();
        }

        $attr = Base\Attr::append($attr,['data'=>$data]);
        $html .= Html::div(null,'results');
        $r .= static::makeClickOpen($html,$title,$after,$attr);

        return $r;
    }
}

// init
TableRelation::__init();
?>