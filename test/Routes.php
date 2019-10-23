<?php
declare(strict_types=1);

/*
 * This file is part of the QuidPHP package.
 * Website: https://quidphp.com
 * License: https://github.com/quidphp/lemur/blob/master/LICENSE
 */

namespace Quid\Test\Lemur;
use Quid\Base;
use Quid\Core;
use Quid\Lemur;
use Quid\Routing;
use Quid\Suite;

// routes
// class for testing routes
class Routes extends Base\Test
{
    // trigger
    public static function trigger(array $data):bool
    {
        // prepare
        $boot = $data['boot'];
        $type = $boot->type();
        $app = $boot->routes($type);
        $request = Core\Request::live();
        $login = Lemur\Cms\Login::class;
        $loginSubmit = Lemur\Cms\LoginSubmit::class;
        $routes = new Routing\Routes([Lemur\Cms::class,Suite\Cms::class]);
        $routes->init('cms');

        // routing
        assert($app->count() === 5);
        assert($routes->type() === 'cms');
        assert($routes->keyParent()[Lemur\Cms\LoginSubmit::class] === Lemur\Cms\Login::class);
        assert(count($routes->hierarchy()) === 10);
        assert(count($routes->childsRecursive($login)) === 5);
        assert($routes->tops()->isCount(10));
        assert($routes->tops() !== $routes);
        assert($routes->top($loginSubmit) === $login);
        assert($routes->parents($loginSubmit)->isCount(1));
        assert($routes->breadcrumb($loginSubmit)->isCount(2));
        assert($routes->breadcrumb($loginSubmit)->last() === $loginSubmit);
        assert($routes->siblings($loginSubmit)->isCount(4));
        assert($routes->childs($login)->isCount(5));
        assert($routes->withSegment()->count() > 5);
        assert($routes->withoutSegment()->count() > 5);
        assert($routes->active()->count() !== $routes->count());
        assert($routes::makeBreadcrumbs('/',null,$login::make(),$loginSubmit::make()) === "<a href='/'>Login</a>/<a href='/en/login/submit' hreflang='en'>Login - Submit</a>");
        assert($routes::makeBreadcrumbs('/',5,$login::make(),$loginSubmit::make()) === "<a href='/'>Login</a>/<a href='/en/login/submit' hreflang='en'>Lo...</a>");

        // classe
        assert($routes->not($routes)->add($routes)->count() > 20);
        assert($routes->not('Home') !== $routes);
        assert($routes->not('Home')->count() === ($routes->count() - 1));
        assert($routes->not($routes)->isEmpty());
        assert($routes->not($routes->not('Home'))->count() === 1);
        assert($routes->pair('priority')['Home'] === 1);
        assert(is_numeric($routes->pairStr('priority')));
        assert($routes->pair('label','%:',null,['error'=>false])['Home'] === 'Home:');
        assert($routes->filter(['group'=>'home'])->isCount(1));
        assert($routes->first(['group'=>'home']) === Lemur\Cms\Home::class);
        assert($routes->filter(['group'=>'error','priority'=>992])->isEmpty());
        assert($routes->filter(['group'=>'error','priority'=>999])->isCount(1));
        assert(count($routes->group('group')) === 9);
        assert($routes->sortBy('name',false)->index(1) === Lemur\Cms\SpecificUserWelcome::class);
        assert($routes->sortBy('name',false) !== $routes);
        assert($routes->sortDefault()->index(0) === Lemur\Cms\Home::class);
        assert($routes->sortDefault() === $routes);

        // map
        assert($routes->isCount(36));
        assert($routes->get('Sitemap') === Lemur\Cms\Sitemap::class);
        assert($routes->get(Lemur\Cms\Sitemap::class) === Lemur\Cms\Sitemap::class);
        assert(!$routes->in('Sitemap'));
        assert($routes->in(Lemur\Cms\Sitemap::class));
        assert($routes->exists('Sitemap'));
        assert($routes->exists(Lemur\Cms\Sitemap::class));
        assert($routes->unset('Sitemap')->isCount(35));
        assert($routes->add(Lemur\Cms\Sitemap::class)->isCount(36));

        return true;
    }
}
?>