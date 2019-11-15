<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Base;
use Quid\Core;

// popupSession
// class for the popup route with the session information
class PopupSession extends Core\RouteAlias
{
    // trait
    use _popup;


    // config
    public static $config = [
        'path'=>[
            'en'=>'popup/session',
            'fr'=>'popup/session'],
        'popup'=>[
            'id','username','email','fullName','roles','fakeRoles','timezone','dateLogin','dateAdd',
            'requestCount','ip','lang','name','getLoginLifetime','getLifetime','expire','getCookieParams','getGarbageCollect',
            'classSession','classFqcn','classRole','userAgent'],
    ];


    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        $return = false;
        
        if(parent::canTrigger())
        {
            $realRoles = static::session()->roles();

            foreach (['popup','sessionPopup'] as $value)
            {
                $return = $this->rolesHasPermission($value,$realRoles);

                if($return === false)
                break;
            }
        }

        return $return;
    }


    // popupClosure
    // callback pour le popup d'informations de la session
    final protected function popupClosure():\Closure
    {
        return function(string $key):array {
            $return = [];
            $label = null;
            $value = null;
            $session = static::session();
            $user = $session->user();
            $sessionKeys = ['requestCount','ip','lang','userAgent','name','getLifetime','expire','getCookieParams','getLoginLifetime','getGarbageCollect'];

            if($user->hasCell($key))
            {
                $value = $user->cell($key);
                $label = $value->label();

                if($value->isRelation())
                $value = $value->pair(true);

                elseif($value->isDate())
                $value = $value->format(1);
            }

            elseif($key === 'classSession')
            $value = $session::classFqcn();

            elseif($key === 'classRole')
            $value = $session->role()::classFqcn();

            elseif($key === 'roles')
            $value = $session->roles(false)->pair('labelPermission');

            elseif($key === 'fakeRoles')
            {
                $fakeRoles = $session->getFakeRoles();
                if(!empty($fakeRoles))
                $value = $fakeRoles->pair('labelPermission');
            }

            elseif(in_array($key,$sessionKeys,true))
            {
                $value = $session->$key();

                if($key === 'lang')
                $value = static::lang()->langLabel($value);

                elseif(is_int($value))
                {
                    if($key === 'expire')
                    $value = Base\Date::format(1,$value);

                    elseif(in_array($key,['getLifetime','getLoginLifetime'],true))
                    $value = Base\Date::amountStr(1,$value);
                }
            }

            else
            $value = $user->$key();

            if($label === null)
            $label = static::langText(['popup','user',$key]);

            $return = [$label,$value];

            return $return;
        };
    }
}

// init
PopupSession::__init();
?>