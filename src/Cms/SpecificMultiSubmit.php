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

// specificMultiSubmit
// class for the submit multi specific route, to process the update of multiple rows in the CMS
class SpecificMultiSubmit extends Core\RouteAlias
{
    // trait
    use _general;
    use Lemur\Route\_formSubmit;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primaries;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'table/[table]/multiple/[primaries]/submit',
            'fr'=>'table/[table]/multiple/[primaries]/soumettre'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primaries'=>'structureSegmentPrimaries'],
        'match'=>[
            'method'=>'post',
            'csrf'=>true,
            'post'=>['-table-'=>['='=>'[table]']],
            'genuine'=>true,
            'session'=>'canAccess'],
        'response'=>[
            'timeLimit'=>120],
        'parent'=>SpecificMulti::class,
        'form'=>[
            'attr'=>[
                'data-skip-form-prepare'=>true,
                'data-unload'=>true,
                'data-validation'=>false]],
        'group'=>'submit'
    ];


    // onBefore
    // validation que les rows sont updateables, il doit y en avoir au moins 2
    final protected function onBefore()
    {
        $return = false;

        if(parent::onBefore())
        {
            $primaries = $this->request()->get('-primaries-');
            $rows = $this->rows();

            if(is_array($primaries) && !empty($primaries) && $rows->count() === count($primaries) && $rows->isMinCount(2) && $rows->exists(...$primaries))
            {
                if($rows->pairEqual(true,'isUpdateable'))
                $return = true;
            }

            $return = true;
        }

        return $return;
    }


    // canTrigger
    // si la route peut être lancé
    final public function canTrigger():bool
    {
        return parent::canTrigger() && $this->hasTable() && $this->table()->hasPermission('view','specific','update','rows','lemurUpdate','multiModify');
    }


    // onFailure
    // callback appelé lors d'un échec
    protected function onFailure():void
    {
        $post = $this->post();
        if(empty($post))
        static::sessionCom()->neg('multiModify/emptyPost');

        return;
    }


    // rows
    // retourne l'objet rows
    final protected function rows():Core\Rows
    {
        return $this->cache(__METHOD__,fn() => $this->table()->rows(...$this->segment('primaries')));
    }


    // routeSuccess
    // retourne la route en cas de succès ou échec de la modification multiple
    // met toutes les lignes dans le highlight
    final public function routeSuccess():General
    {
        return $this->general()->changeSegment('highlight',$this->rows());
    }


    // routeFailure
    // retourne l'objet à la route de multi modification en cas d'échec (par exemple post vide)
    final protected function routeFailure():SpecificMulti
    {
        return static::makeParent($this->segments());
    }


    // proceed
    // fait la mise à jour sur la ligne
    final public function proceed():?array
    {
        $return = null;
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if(is_array($post) && !empty($post))
        {
            $return = [];
            $rows = $this->rows();
            $last = $rows->last();

            foreach ($rows as $key => $row)
            {
                $deleteSource = ($row === $last);
                $option = ['uploadDeleteSource'=>$deleteSource,'preValidate'=>true,'com'=>true,'catchException'=>true,'context'=>static::class];
                $save = $row->setUpdateValid($post,$option);
                $return[$key] = $save;
            }
        }

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }

}

// init
SpecificMultiSubmit::__init();
?>