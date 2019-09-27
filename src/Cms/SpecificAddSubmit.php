<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Core;

// specificAddSubmit
// class for the submit specific add route, to process the insertion of a new row in the CMS
class SpecificAddSubmit extends Core\RouteAlias
{
    // trait
    use _common;
    use _general;
    use _specificSubmit;
    use Core\Route\_formSubmit;
    use Core\Segment\_table;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/[table]/add/0/submit',
            'fr'=>'table/[table]/ajouter/0/soumettre'],
        'segment'=>[
            'table'=>'structureSegmentTable'],
        'match'=>[
            'method'=>'post',
            'role'=>['>='=>20]],
        'verify'=>[
            'csrf'=>false,
            'genuine'=>true,
            'post'=>['-table-'=>['='=>'[table]']]],
        'response'=>[
            'timeLimit'=>60],
        'parent'=>SpecificAdd::class,
        'group'=>'submit'
    ];


    // onBefore
    // validation avant le lancement de la route
    protected function onBefore()
    {
        $return = false;
        $table = $this->table();

        if(!empty($table) && $table->hasPermission('view','add','insert'))
        $return = true;

        return $return;
    }


    // fallbackRouteRedirect
    // si c'est un failedFileUpload, renvoie vers le referer
    public function fallbackRouteRedirect($context=null)
    {
        return ($this->request()->isFailedFileUpload())? true:null;
    }


    // proceed
    // insère la ligne
    protected function proceed():?Core\Row
    {
        $return = null;
        $context = static::context();
        $post = $this->post();
        $post = $this->onBeforeCommit($post);

        if($post !== null)
        {
            $table = $this->table();
            $db = $table->db();
            $db->setExceptionClass(true); // catchable exception
            $return = $table->insert($post,['preValidate'=>true,'com'=>true,'context'=>$context]);
            $db->setExceptionClass(false);
        }

        if(empty($return))
        $this->failureComplete();

        else
        $this->successComplete();

        return $return;
    }


    // setFlash
    // enregistre les données dans l'objet flash
    protected function setFlash():void
    {
        $post = $this->post();
        $flash = $this->session()->flash();
        $key = [$this->classFqcn(),$this->table()];
        $flash->set($key,$post);

        return;
    }
}

// config
SpecificAddSubmit::__config();
?>