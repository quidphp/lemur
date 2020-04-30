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

// specificSubmit
// class for the submit specific route, to process the update of a row in the CMS
class SpecificSubmit extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use _specificSubmit;
    use Lemur\Route\_specificPrimary;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primary;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'table/[table]/[primary]/submit',
            'fr'=>'table/[table]/[primary]/soumettre'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary'],
        'match'=>[
            'method'=>'post',
            'csrf'=>true,
            'post'=>['-primary-'=>['='=>'[primary]'],'-table-'=>['='=>'[table]']],
            'genuine'=>true,
            'session'=>'canAccess'],
        'response'=>[
            'timeLimit'=>60],
        'parent'=>Specific::class,
        'group'=>'submit'
    ];


    // canTrigger
    // validation avant le lancement
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->table();
        $row = $this->segment('primary');

        if(parent::canTrigger() && !empty($table) && $table->hasPermission('view','specific','update','lemurUpdate') && !empty($row) && $row->isUpdateable())
        $return = true;

        return $return;
    }


    // proceed
    // fait la mise à jour sur la ligne
    final public function proceed():?int
    {
        $return = null;
        $post = $this->post();
        $post = $this->onBeforeCommit($post);
        $timestamp = $this->request()->postTimestamp();
        $row = $this->row();

        if($post !== null)
        $return = $row->setUpdateValid($post,['preValidate'=>true,'com'=>true,'catchException'=>true,'timestamp'=>$timestamp,'context'=>static::class]);

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }
}

// init
SpecificSubmit::__init();
?>