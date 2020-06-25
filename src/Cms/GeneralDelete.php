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
use Quid\Core;
use Quid\Lemur;

// generalDelete
// class for the route which allows deleting rows from the general navigation page of the CMS
class GeneralDelete extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use Lemur\Route\_formSubmit;
    use Lemur\Segment\_table;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'table/[table]/multi/delete',
            'fr'=>'table/[table]/multiple/effacer'],
        'segment'=>[
            'table'=>'structureSegmentTable'],
        'match'=>[
            'method'=>'post',
            'csrf'=>true,
            'genuine'=>true,
            'post'=>['-table-'=>['='=>'[table]']],
            'session'=>'canAccess'],
        'parent'=>General::class,
        'group'=>'submit'
    ];


    // dynamique
    protected array $ids = []; // conserve les ids pour la route


    // onBefore
    // validation des permissions avant de lancer la route
    // les ids à effacer sont conservé
    final protected function onBefore()
    {
        $return = false;

        if(parent::onBefore())
        {
            $ids = $this->request()->get('primaries');
            $this->makeIds((string) $ids);

            if(!empty($this->ids))
            $return = true;
        }

        return $return;
    }


    // canTrigger
    // si la route peut être lancé
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasTable() && $this->table()->hasPermission('view','general','delete','rows','lemurDelete','multiDelete');
    }


    // makeIds
    // prend une valeur et store la propriété ids
    final protected function makeIds(string $ids):void
    {
        if(!empty($ids))
        {
            $default = static::getDefaultSegment();
            $ids = Base\Str::explodeTrimClean($default,$ids);

            if(is_array($ids) && !empty($ids) && Base\Arr::onlyNumeric($ids))
            $this->ids = Base\Arr::cast($ids);
        }
    }


    // ids
    // retourne le tableau des ids
    final protected function ids():array
    {
        return $this->ids;
    }


    // rows
    // retourne l'objet rows
    final protected function rows():Core\Rows
    {
        return $this->table()->rows(...$this->ids());
    }


    // routeSuccess
    // retourne la route en cas de succès ou échec de la suppression
    final public function routeSuccess():Core\Route
    {
        return $this->general();
    }


    // proceed
    // efface la row ou les rows
    final protected function proceed():?int
    {
        $return = null;
        $post = $this->post();
        $post = $this->onBeforeCommit($post);
        $timestamp = $this->request()->postTimestamp();

        if($post !== null)
        $return = $this->rows()->delete(['com'=>true,'timestamp'=>$timestamp]);

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }
}

// init
GeneralDelete::__init();
?>