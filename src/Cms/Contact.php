<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Lemur\Cms;
use Quid\Lemur;
use Quid\Base;

// contact
// class for the contact form route of the CMS
class Contact extends Lemur\Route\Contact
{
    // trait
    use _modal;
    
    
    // config
    public static $config = [];
    
    
    // canTrigger
    // retourne vrai si la route peut être trigger
    final public function canTrigger():bool
    {
        return (parent::canTrigger() && $this->hasPermission('contact'))? true:false;
    }
    
    
    // trigger
    // lance la route contact
    final public function trigger() 
    {
        $return = Base\Str::loremIpsum(10);
        
        return $return;
    }
}

// init
Contact::__init();
?>