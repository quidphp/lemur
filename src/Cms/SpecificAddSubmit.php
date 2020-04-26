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

// specificAddSubmit
// class for the submit specific add route, to process the insertion of a new row in the CMS
class SpecificAddSubmit extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use _specificSubmit;
    use Lemur\Segment\_table;


    // config
    public static array $config = [
        'path'=>[
            'en'=>'table/[table]/add/0/submit',
            'fr'=>'table/[table]/ajouter/0/soumettre'],
        'segment'=>[
            'table'=>'structureSegmentTable'],
        'match'=>[
            'method'=>'post',
            'session'=>'canAccess',
            'csrf'=>false,
            'genuine'=>true,
            'post'=>['-table-'=>['='=>'[table]']]],
        'response'=>[
            'timeLimit'=>60],
        'parent'=>SpecificAdd::class,
        'group'=>'submit',
        'flashPost'=>true,
        'form'=>[
            'attr'=>[
                'data-unload'=>true,
                'data-validation'=>false]]
    ];


    // canTrigger
    // validation avant le lancement de la route
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->table();

        if(parent::canTrigger() && !empty($table) && $table->hasPermission('view','specific','insert','lemurInsert'))
        $return = true;

        return $return;
    }


    // fallbackRouteRedirect
    // si c'est un failedFileUpload, renvoie vers le referer
    final protected function fallbackRouteRedirect($context=null)
    {
        return ($context === 'failedFileUpload')? true:null;
    }


    // proceed
    // insère la ligne
    final protected function proceed():?Core\Row
    {
        $return = null;
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        {
            $table = $this->table();
            $return = $table->insert($post,['preValidate'=>true,'com'=>true,'catchException'=>false,'context'=>static::class]);
        }

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }
}

// init
SpecificAddSubmit::__init();
?>