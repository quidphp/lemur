<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;
use Quid\Lemur;
use Quid\Base\Html;
use Quid\Orm;

// SpecificTableRelation
// class for the route which manages table relation, used by some inputs in the CMS
class SpecificTableRelation extends Core\RouteAlias
{
    // trait
    use _common;
    use Lemur\Route\_relation;
    use Lemur\Segment\_table;
    use Lemur\Segment\_orderTableRelation;
    use Lemur\Segment\_page;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'table/relation/[table]/[order]/[page]',
            'en'=>'table/relation/[table]/[order]/[page]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'order'=>'structureSegmentOrderTableRelation',
            'page'=>'structureSegmentPage'],
        'method'=>'tableRelationOutput',
        'order'=>true,
        'match'=>[
            'ajax'=>true,
            'role'=>['>='=>20]],
    ];


    // onBefore
    // validation avant le lancement de la route
    protected function onBefore()
    {
        $return = false;
        $table = $this->segment('table');

        if($table instanceof Core\Table && $table->hasPermission('view','relation','tableRelation'))
        $return = true;

        return $return;
    }
    
    
    // relation
    // retourne l'objet relation de la table
    public function relation():Orm\Relation
    {
        return $this->segment('table')->relation();
    }

    
    // trigger
    // lance la route tableRelation
    public function trigger():string
    {
        $r = '';
        $grab = $this->relationGrab();
        
        if(!empty($grab))
        {
            ['result'=>$results,'count'=>$count] = $grab;
            
            if(is_array($results) && !empty($results))
            $r .= $this->makeResults($results,'list',true);
        }
        
        if(empty($r))
        $r .= Html::h3(static::langText('common/nothing'));
        
        $r = Html::div($r,'relationWrap');
        
        return $r;
    }


    // isSearchValueValid
    // retourne vrai si la valeur de recherche est valide
    protected function isSearchValueValid(string $value):bool
    {
        return ($this->segment('table')->isSearchTermValid($value))? true:false;
    }


    // relationKeyValue
    // retourne les keyValue à partir de valeur de relation
    protected function relationKeyValue(array $values):?array
    {
        $return = null;
        $table = $this->segment('table');
        $return = $table->relation()->gets($values,true,false);

        return $return;
    }


    // makeResults
    // génère les résultats d'affichage de la relation
    protected function makeResults(array $array,$attr=null,bool $loadMore=false):string
    {
        $r = '';

        if(!empty($array))
        {
            foreach ($array as $key => $value)
            {
                $r .= Html::li($value);
            }

            if(!empty($r) && $loadMore === true)
            $r .= $this->loadMore();

            $r = Html::ulCond($r,$attr);
        }

        return $r;
    }


    // makeClickOpen
    // génère le html pour le clickOpen
    public static function makeClickOpen(Core\Table $table,Core\Route $route,$class=null):string
    {
        $r = '';
        $html = '';
        $relation = $table->relation();
        $size = $relation->size();
        $label = $table->label();
        $after = null;

        $limit = $route->limit();
        $query = $route::getSearchQuery();
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

        $html .= Html::div(null,'result');
        $r .= Html::clickOpen($html,$label,$after,[$class,'data'=>$data]);

        return $r;
    }
}

// init
SpecificTableRelation::__init();
?>