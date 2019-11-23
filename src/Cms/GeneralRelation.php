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
use Quid\Core;
use Quid\Lemur;

// generalRelation
// class for the route which manages the filters for the general navigation page of the CMS
class GeneralRelation extends Core\RouteAlias
{
    // trait
    use _relation;
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
            'en'=>'general/relation/[table]/[col]/[selected]/[order]/[page]',
            'fr'=>'general/relation/[table]/[col]/[selected]/[order]/[page]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'col'=>'structureSegmentColRelation',
            'selected'=>'structureSegmentSelected',
            'order'=>'structureSegmentOrderColRelation',
            'page'=>'structureSegmentPage'],
        'showCount'=>true,
        'showEmptyNotEmpty'=>true,
        'parent'=>General::class
    ];


    // canTrigger
    // retourne vrai si la route peut être triggé
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->segment('table');
        $relation = $this->relation();

        if(parent::canTrigger() && $table instanceof Core\Table && $table->hasPermission('view','general','filter','relation','generalRelation'))
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
    final protected function getRoute():Core\Route
    {
        return $this->general();
    }
}

// init
GeneralRelation::__init();
?>