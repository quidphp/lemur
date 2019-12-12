<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Author: Pierre-Philippe Emond <emondpph@gmail.com>
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 * Readme: https://github.com/quidphp/lemur/blob/master/README.md
 */

namespace Quid\Test\Lemur;
use Quid\Base;
use Quid\Lemur;

// boot
// class for testing Quid\Lemur\Boot
class Boot extends Base\Test
{
    // trigger
    final public static function trigger(array $data):bool
    {
        // prepare
        $boot = Lemur\Boot::inst();

        // isCms
        assert(!$boot->isCms());

        // lang
        $lang = $boot->lang();
        assert(count($lang->relation('contextType')) === 3);
        assert(!empty($lang->tableDescription('user')));
        assert(!empty($lang->colDescription('metaKeywords_en')));
        assert(!empty($lang->panelDescription('default')));

        // session
        $session = $boot->session();
        $user = $boot->db()['user'][1];
        assert($user->isNobody());
        assert($user->hasPermission('cmsLogin') === false);
        assert($session->user()->hasPermission('cmsLogin'));

        return true;
    }
}
?>