<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;
use Quid\Lemur;

// specificRelation
// class for the route which manages specific relation - enumSet inputs in the specific form
class SpecificRelation extends Core\RouteAlias
{
    // trait
    use _common;
    use _specificRelation;
    use Lemur\Segment\_table;
    use Lemur\Segment\_colRelation;
    use Lemur\Segment\_selected;
    use Lemur\Segment\_orderColRelation;
    use Lemur\Segment\_page;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'specific/relation/[table]/[col]/[selected]/[order]/[page]',
            'fr'=>'specifique/relation/[table]/[col]/[selected]/[order]/[page]'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'col'=>'structureSegmentColRelation',
            'selected'=>'structureSegmentSelected',
            'order'=>'structureSegmentOrderColRelation',
            'page'=>'structureSegmentPage'],
        'parent'=>Specific::class,
        'showCount'=>true
    ];


    // canTrigger
    // validation avant le lancement de la route
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->segment('table');
        $relation = $this->relation();

        if(parent::canTrigger() && $table instanceof Core\Table && $table->hasPermission('view','specific','relation','specificRelation'))
        {
            if($relation->isRelationTable())
            {
                $relationTable = $relation->relationTable();
                $return = $relationTable->hasPermission('relation','specificRelation');
            }

            else
            $return = true;
        }

        return $return;
    }
}

// init
SpecificRelation::__init();
?>