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
use Quid\Base;
use Quid\Core;

// popupBoot
// class for the popup route with the boot information
class PopupBoot extends Core\RouteAlias
{
    // trait
    use _popup;


    // config
    public static $config = [
        'path'=>[
            'en'=>'popup/boot/[route]',
            'fr'=>'popup/demerrage/[route]'],
        'segment'=>[
            'route'=>'structureSegmentRoute'],
        'popup'=>[
            'phpVersion','quidVersion','envLabel','typeLabel','classFqcn','classRoute','hostname','httpProtocol','ip',
            'os','isCaseSensitive','processId','user','group','serverType','sapi','paths','phpOverview','jsOverview','cssOverview','schemeHosts','memory',
            'diskSpace','phpImportantExtension','phpImportantIni']
    ];


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasPermission('popup','bootPopup'));
    }


    // popupClosure
    // callback pour le popup d'informations de boot
    final protected function popupClosure():\Closure
    {
        return function(string $key):array {
            $return = [];
            $label = null;
            $value = null;
            $boot = static::boot();

            if(in_array($key,['envLabel','typeLabel','paths','schemeHosts','classFqcn'],true))
            $value = $boot->$key();

            elseif($key === 'classRoute')
            $value = $this['route'];

            elseif($key === 'phpOverview')
            $value = $boot->pathOverview('src','php');

            elseif($key === 'jsOverview')
            $value = $boot->pathOverview('js',['js','jsx']);

            elseif($key === 'cssOverview')
            $value = $boot->pathOverview('css',['css','scss']);

            elseif($key === 'user')
            $value = Base\Server::$key(true,true);

            elseif($key === 'os')
            $value = Base\Server::os(true,true);

            elseif($key === 'ip')
            $value = Base\Server::ip(true);

            else
            $value = Base\Server::$key();

            if($label === null)
            $label = static::langText(['popup','boot',$key]);

            $return = [$label,$value];

            return $return;
        };
    }


    // structureSegmentRoute
    // gère le segment de route
    final public static function structureSegmentRoute(string $type,$value)
    {
        $return = false;

        if($value instanceof Core\Route)
        $value = $value::className();

        if(is_string($value))
        {
            if($type === 'make')
            $return = $value;

            elseif($type === 'match' && is_string($value))
            $return = static::boot()->routes()->get($value) ?? false;
        }

        return $return;
    }
}

// init
PopupBoot::__init();
?>