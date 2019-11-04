<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
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
    public static $config = [
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
            'role'=>['>'=>'user']],
        'parent'=>General::class,
        'group'=>'submit'
    ];


    // dynamique
    protected $ids = null; // conserve les ids à effacer


    // onBefore
    // validation des permissions avant de lancer la route
    // les ids à effacer sont conservé
    protected function onBefore()
    {
        $return = false;
        $table = $this->table();

        if(!empty($table) && $table->hasPermission('view','delete','lemurDelete','multiDelete'))
        {
            $request = $this->request();
            $ids = $request->get('primaries');

            if(is_scalar($ids) && !empty($ids))
            {
                $ids = (string) $ids;
                $ids = Base\Str::explodeTrimClean(static::getDefaultSegment(),$ids);

                if(Base\Arr::onlyNumeric($ids))
                {
                    $this->ids = Base\Arr::cast($ids);
                    $return = true;
                }
            }
        }

        return $return;
    }


    // ids
    // retourne le tableau des ids à effacer
    protected function ids():array
    {
        return $this->ids;
    }


    // rows
    // retourne les rows à effacer
    protected function rows():Core\Rows
    {
        return $this->table()->rows(...$this->ids());
    }


    // routeSuccess
    // retourne la route en cas de succès ou échec de la suppression
    public function routeSuccess():Core\Route
    {
        return $this->general();
    }


    // proceed
    // efface la row ou les rows
    protected function proceed():?int
    {
        $return = null;
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $this->rows()->delete(['com'=>true,'context'=>static::class]);

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