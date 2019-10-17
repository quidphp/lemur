<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur;
use Quid\Core;

// role
// extended abstract class that provides cms logic for a role
abstract class Role extends Core\Role
{
    // config
    public static $config = [
        'can'=>[
            'login'=>[
                'cms'=>false]],  // défini ou l'utilisateur peut se connecter
        '@cms'=>[ // ceci définit les éléments d'interfaces du CMS à afficher/cache
            'can'=>[
                'account'=>true,
                'accountChangePassword'=>true,
                'userPopup'=>false,
                'logout'=>true,
                'footerTypes'=>true,
                'footerTypesCms'=>false,
                'footerModules'=>true,
                'bootPopup'=>false,
                'about'=>true,
                'home'=>[
                    'info'=>true,
                    'infoPopup'=>false,
                    'search'=>true]]]
    ];
}

// init
Role::__init();
?>