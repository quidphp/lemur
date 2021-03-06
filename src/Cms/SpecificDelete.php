<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package <https://quidphp.com>
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;
use Quid\Lemur;

// specificDelete
// class for the specific delete route, to process a row deletion in the CMS
class SpecificDelete extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use Lemur\Route\_specificPrimary;
    use Lemur\Route\_formSubmit;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primary;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'table/[table]/[primary]/delete',
            'fr'=>'table/[table]/[primary]/effacer'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary'],
        'match'=>[
            'csrf'=>true,
            'genuine'=>true,
            'method'=>'post',
            'post'=>['-primary-'=>['='=>'[primary]'],'-table-'=>['='=>'[table]']],
            'session'=>'canAccess'],
        'parent'=>Specific::class,
        'group'=>'submit'
    ];


    // canTrigger
    // validation avant le lancement de la route
    final public function canTrigger():bool
    {
        $table = $this->table();
        $row = $this->segment('primary');
        return parent::canTrigger() && !empty($table) && $table->hasPermission('view','specific','delete','lemurDelete') && !empty($row) && $row->isDeleteable();
    }


    // routeSuccess
    // retourne la route en cas de succès ou échec de la suppression
    // renvoie à la même page ou l'élément se trouvait, sauf si c'était le dernier (renvoie à la première page)
    // en cas d'échec de la suppression, renvoie vers specific
    final public function routeSuccess():Core\Route
    {
        $return = null;

        if($this->success === true)
        {
            $return = $this->general();
            $rows = $return->rows();

            if($rows->isEmpty())
            $return = $return->changeSegment('page',1);
        }

        else
        $return = $this->row()->route();

        return $return;
    }


    // proceed
    // efface la row
    final protected function proceed():?int
    {
        $return = null;
        $post = $this->post();
        $post = $this->onBeforeCommit($post);
        $timestamp = $this->request()->postTimestamp();

        if($post !== null)
        $return = $this->row()->delete(['com'=>true,'timestamp'=>$timestamp]);

        return $this->proceedAfter($return);
    }
}

// init
SpecificDelete::__init();
?>