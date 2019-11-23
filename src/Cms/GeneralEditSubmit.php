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

// generalEditSubmit
// class for the route to manage the form to quick edit a cell from the general page
class GeneralEditSubmit extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use Lemur\Route\_formSubmit;
    use Lemur\Route\_specificPrimary;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primary;
    use Lemur\Segment\_col;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/[table]/[primary]/[col]/submit',
            'fr'=>'table/[table]/[primary]/[col]/soumettre'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary',
            'col'=>'structureSegmentCol'],
        'match'=>[
            'method'=>'post',
            'csrf'=>true,
            'genuine'=>true,
            'post'=>['-primary-'=>['='=>'[primary]'],'-table-'=>['='=>'[table]']],
            'session'=>'canAccess'],
        'response'=>[
            'timeLimit'=>60],
        'parent'=>GeneralEdit::class,
        'group'=>'submit',
        'form'=>[
            'attr'=>[
                'data-unload'=>'common/unload',
                'data-validation'=>false]]
    ];


    // canTrigger
    // validation si la route peut être lancé
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && static::makeParent($this->segments())->canTrigger())? true:false;
    }


    // routeSuccess
    // retourne la route en cas de succès ou échec de la suppression
    final public function routeSuccess():Core\Route
    {
        return $this->general();
    }


    // cell
    // retourne la cellule
    final protected function cell():Lemur\Cell
    {
        return $this->row()->cell($this->segment('col'));
    }


    // proceed
    // modifie la cellule
    final protected function proceed():?int
    {
        $return = null;
        $cell = $this->cell();
        $row = $this->row();
        $name = $cell->name();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null && array_key_exists($name,$post))
        $return = $row->setUpdateValid($post,['preValidate'=>true,'com'=>true,'catchException'=>true,'context'=>static::class]);

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }
}

// init
GeneralEditSubmit::__init();
?>