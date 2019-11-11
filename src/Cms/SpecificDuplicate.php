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

// specificDuplicate
// class for the specific duplicate route, to process a row duplication in the CMS
class SpecificDuplicate extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use Lemur\Route\_specificPrimary;
    use Lemur\Route\_formSubmit;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primary;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/[table]/[primary]/duplicate',
            'fr'=>'table/[table]/[primary]/dupliquer'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary'],
        'match'=>[
            'method'=>'post',
            'csrf'=>true,
            'genuine'=>true,
            'role'=>['>'=>'user']],
        'parent'=>Specific::class,
        'group'=>'specific'
    ];


    // dynamique
    protected $duplicate = null; // garde une copie de la nouvelle ligne


    // onBefore
    // validation avant le lancement
    final protected function onBefore()
    {
        $return = false;
        $table = $this->table();
        $row = $this->segment('primary');

        if(!empty($table) && $table->hasPermission('view','insert','lemurInsert','duplicate') && !empty($row))
        $return = true;

        return $return;
    }


    // onSuccess
    // traite le succès
    final protected function onSuccess():void
    {
        $this->getDuplicate()->updateCom('duplicate/success','pos',null,null,null,true);

        return;
    }


    // onFailure
    // traite l'échec
    final protected function onFailure():void
    {
        $this->row()->table()->insertCom('duplicate/failure','neg',null,null,null,true);

        return;
    }


    // routeSuccess
    // retourne la route en cas de succès de la duplication
    final public function routeSuccess():Core\Route
    {
        return static::makeParent($this->getDuplicate());
    }


    // routeFailure
    // retourne la route en cas d'échec de la duplication
    final public function routeFailure():Core\Route
    {
        return static::makeParent($this->segments());
    }


    // getDuplicate
    // retourne la row duplicate
    final public function getDuplicate():Core\Row
    {
        return $this->duplicate;
    }


    // proceed
    // duplicate la row courante
    final protected function proceed():?Core\Row
    {
        $return = null;
        $row = $this->row();
        $table = $row->table();
        $context = static::context();
        $com = static::sessionCom();
        $option = ['com'=>true,'context'=>$context];
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $row->duplicate($option);

        if(empty($return))
        $this->failureComplete();

        else
        {
            $this->duplicate = $return;
            $this->successComplete();
        }

        return $return;
    }
}

// init
SpecificDuplicate::__init();
?>