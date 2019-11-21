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

// generalTruncate
// class for the route which allows truncating a table from the general page of the CMS
class GeneralTruncate extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use Lemur\Route\_formSubmit;
    use Lemur\Segment\_table;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/[table]/truncate',
            'fr'=>'table/[table]/vider'],
        'segment'=>[
            'table'=>'structureSegmentTable'],
        'match'=>[
            'csrf'=>true,
            'genuine'=>true,
            'method'=>'post',
            'post'=>['-table-'=>['='=>'[table]']],
            'session'=>'canLogin'],
        'parent'=>General::class,
        'group'=>'submit'
    ];


    // canTrigger
    // retourne vrai si la route peut être triggé
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->table();

        if(parent::canTrigger() && !empty($table) && $table->hasPermission('view','truncate','lemurTruncate'))
        $return = true;

        return $return;
    }


    // routeSuccess
    // retourne la route en cas de succès ou échec du truncate
    final public function routeSuccess():Core\Route
    {
        return $this->general(false);
    }


    // proceed
    // truncate la table
    final protected function proceed():bool
    {
        $return = false;
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        $return = $this->table()->truncate(['com'=>true,'context'=>static::class]);

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }
}

// init
GeneralTruncate::__init();
?>