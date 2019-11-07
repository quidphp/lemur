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
    public static $config = [
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
            'role'=>['>'=>'user']],
        'response'=>[
            'timeLimit'=>60],
        'parent'=>Specific::class,
        'group'=>'submit'
    ];


    // onBefore
    // validation avant le lancement
    final protected function onBefore()
    {
        $return = false;
        $table = $this->table();
        $row = $this->segment('primary');

        if(!empty($table) && $table->hasPermission('view','update','lemurUpdate') && !empty($row) && $row->isUpdateable())
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

        if($post !== null)
        {
            $row = $this->row();
            $db = $row->db();
            $db->setExceptionClass(true);
            $return = $row->setUpdateValid($post,['preValidate'=>true,'com'=>true,'context'=>static::class]);
            $db->setExceptionClass(false);
        }

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