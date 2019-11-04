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
            'role'=>['>'=>'user']],
        'parent'=>General::class,
        'group'=>'submit'
    ];


    // onBefore
    // vérifie que l'utilisateur a la permission pour truncate la table
    protected function onBefore()
    {
        $return = false;
        $table = $this->table();

        if(!empty($table) && $table->hasPermission('view','truncate','lemurTruncate'))
        $return = true;

        return $return;
    }


    // routeSuccess
    // retourne la route en cas de succès ou échec du truncate
    public function routeSuccess():Core\Route
    {
        return $this->general(false);
    }


    // proceed
    // truncate la table
    protected function proceed():bool
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