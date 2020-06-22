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

// specificDispatch
// class for the specific dispatch route, directs to the proper dispatch route of the CMS
class SpecificDispatch extends Core\RouteAlias
{
    // trait
    use _general;
    use Lemur\Route\_specificPrimary;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primary;


    // config
    protected static array $config = [
        'path'=>[
            'en'=>'table/[table]/[primary]/dispatch',
            'fr'=>'table/[table]/[primary]/envoyer'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary'],
        'match'=>[
            'method'=>'post',
            'session'=>'canAccess',
            'csrf'=>false,
            'genuine'=>true,
            'post'=>['-primary-'=>['='=>'[primary]'],'-table-'=>['='=>'[table]']]],
        'dispatch'=>[
            '--modify--'=>SpecificSubmit::class,
            '--duplicate--'=>SpecificDuplicate::class,
            '--delete--'=>SpecificDelete::class,
            '--userWelcome--'=>UserWelcome::class],
        'response'=>[
            'timeLimit'=>60],
        'parent'=>Specific::class,
        'group'=>'submit',
        'form'=>[
            'attr'=>[
                'data-unload'=>true,
                'data-validation'=>false]]
    ];


    // trigger
    // lance la route
    final public function trigger()
    {
        $return = false;
        $route = $this->getRouteLaunch();

        if(!empty($route) && $route->canTrigger())
        {
            $route->start();
            $return = true;
        }

        return $return;
    }


    // canTrigger
    // validation avant le lancement de la route
    final public function canTrigger():bool
    {
        $return = false;
        $table = $this->table();

        if(parent::canTrigger() && !empty($table) && $table->hasPermission('view','specific'))
        $return = true;

        return $return;
    }


    // getRouteLaunch
    // retourne la route a lancé
    final protected function getRouteLaunch():?Core\Route
    {
        $return = null;
        $request = $this->request();
        $post = $request->post();
        $segment = $this->segments();

        foreach ($this->getAttr('dispatch') as $key => $value)
        {
            if(array_key_exists($key,$post) && $post[$key] === 1)
            $return = $value::make($segment);
        }

        return $return;
    }


    // onFallback
    // si c'est un failedFileUpload, renvoie vers le referer
    final protected function onFallback($context=null)
    {
        return ($context === 'failedFileUpload')? true:null;
    }
}

// init
SpecificDispatch::__init();
?>