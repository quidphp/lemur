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

// specificDispatch
// class for the specific dispatch route, directs to the proper dispatch route of the CMS
class SpecificDispatch extends Core\RouteAlias
{
    // trait
    use Lemur\Route\_specificPrimary;
    use Lemur\Segment\_table;
    use Lemur\Segment\_primary;


    // config
    public static $config = [
        'path'=>[
            'en'=>'table/[table]/[primary]/dispatch',
            'fr'=>'table/[table]/[primary]/envoyer'],
        'segment'=>[
            'table'=>'structureSegmentTable',
            'primary'=>'structureSegmentPrimary'],
        'match'=>[
            'method'=>'post',
            'role'=>['>='=>20],
            'csrf'=>false,
            'genuine'=>true,
            'post'=>['id'=>['='=>'[primary]'],'-table-'=>['='=>'[table]']]],
        'dispatch'=>[
            '--modify--'=>SpecificSubmit::class,
            '--duplicate--'=>SpecificDuplicate::class,
            '--delete--'=>SpecificDelete::class,
            '--userWelcome--'=>SpecificUserWelcome::class],
        'parent'=>Specific::class,
        'group'=>'submit',
        'form'=>[
            'attr'=>['data-validation'=>false]],
    ];


    // onBefore
    // lance la route
    // comme les routes redirigent toujours, on ne devrait jamais se rendre à routeException
    protected function onBefore()
    {
        $route = $this->getRouteLaunch();
        $route->start();
        static::routeException(null,'specificDispatchFailed');

        return;
    }


    // getRouteLaunch
    // retourne la route a lancé
    protected function getRouteLaunch():Core\Route
    {
        $return = null;
        $request = $this->request();
        $post = $request->post();
        $segment = $this->segments();

        foreach (static::$config['dispatch'] as $key => $value)
        {
            if(array_key_exists($key,$post) && $post[$key] === 1)
            $return = $value::makeOverload($segment);
        }

        if(empty($return))
        static::catchable(null,'noRedirectRoute');

        return $return;
    }


    // onFallback
    // si c'est un failedFileUpload, renvoie vers le referer
    protected function onFallback($context=null)
    {
        return ($context === 'failedFileUpload')? true:null;
    }
}

// init
SpecificDispatch::__init();
?>