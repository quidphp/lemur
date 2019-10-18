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

// generalRelation
// class for the route which manages the filters for the general navigation page of the CMS
class GeneralRelation extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use Lemur\Route\_generalRelation;
    use Lemur\Segment\_table;
    use Lemur\Segment\_colRelation;
    use Lemur\Segment\_selected;
    use Lemur\Segment\_orderColRelation;
    use Lemur\Segment\_page;


    // config
    public static $config = [
        'path'=>[
            'fr'=>'general/relation/[table]/[col]/[selected]/[order]/[page]',
            'en'=>'general/relation/[table]/[col]/[selected]/[order]/[page]'],
            'encoding'=>'structureSegmentEncoding',
        'segment'=>[
            'table'=>'structureSegmentTable',
            'col'=>'structureSegmentColRelation',
            'selected'=>'structureSegmentSelected',
            'order'=>'structureSegmentOrderColRelation',
            'page'=>'structureSegmentPage'],
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
        $relation = $this->relation();

        if($table instanceof Core\Table && $table->hasPermission('view','relation','generalRelation'))
        {
            if($relation->isRelationTable())
            {
                $relationTable = $relation->relationTable();
                if($relationTable->hasPermission('relation','generalRelation'))
                $return = true;
            }

            else
            $return = true;
        }

        return $return;
    }


    // getRoute
    // retourne la route à utiliser
    protected function getRoute():Core\Route
    {
        return $this->general();
    }
}

// init
GeneralRelation::__init();
?>