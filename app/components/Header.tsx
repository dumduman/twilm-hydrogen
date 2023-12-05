import {useParams, Form, Await, useLocation} from '@remix-run/react';
import {Suspense, useEffect, useMemo, useState} from 'react';
import {Image} from '@shopify/hydrogen';

import {useRootLoaderData} from '~/root';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
} from '~/components';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {type EnhancedMenu} from '~/lib/utils';

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function AccountLink({className}: {className?: string}) {
  const rootData = useRootLoaderData();
  const isLoggedIn = rootData?.isLoggedIn;

  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRootLoaderData();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}
function useHeaderOpacity() {
  const [headerOpacity, setHeaderOpacity] = useState<number>(0);
  const location = useLocation();
  // const {y} = useWindowScroll();
  useEffect(() => {
    if (typeof window !== 'undefined' && location.pathname === '/') {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y < 400) {
          for (let i = 10; i <= 100; i += 10) {
            if (y < i * 4) {
              setHeaderOpacity(i - 10);
              return;
            }
          }
          setHeaderOpacity(100);
          return;
        }
        setHeaderOpacity(100);
      });
    }
  }, [location]);

  return [headerOpacity];
}

export function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
  openMenu,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
  openMenu: () => void;
}) {
  const params = useParams();
  // const {y} = useWindowScroll();
  const [headerOpacity] = useHeaderOpacity();
  // const [headerOpacity, setHeaderOpacity] = useState<number>(0);
  // const {y} = useWindowScroll();
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     window.addEventListener('scroll', () => {
  //       const y = window.scrollY;
  //       if (y < 400) {
  //         for (let i = 10; i <= 100; i += 10) {
  //           if (y < i * 4) {
  //             setHeaderOpacity(i);
  //             return;
  //           }
  //         }
  //       }
  //       setHeaderOpacity(100);
  //     });
  //   }
  // }, []);

  // return [headerOpacity];

  const additionalClassNames = isHome
    ? ``
    : 'bg-contrast/80 sticky backdrop-blur-lg';
  const additionalStyles = isHome
    ? {backgroundColor: `rgb(255 255 255 / ${headerOpacity / 100}`}
    : {};

  return (
    <header
      // role="banner"
      className={`fixed hidden h-nav lg:flex items-center z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8 ${additionalClassNames}`}
      style={additionalStyles}
    >
      <div className="flex gap-12 justify-between">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
      </div>

      <nav className="flex gap-8">
        <Link to="/" prefetch="intent">
          <Image
            loader={() =>
              'https://cdn.shopify.com/s/files/1/0608/4748/9282/files/Primary_Logo_black.png?v=1701653757'
            }
            width="100"
          />
        </Link>
        {/* Top level menu items */}
        {/* {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
              className={({isActive}) =>
                isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
              }
            >
              {item.title}
            </Link>
          ))} */}
      </nav>

      <div className="flex items-center gap-1">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex items-center gap-2"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
          >
            <IconSearch />
          </button>
        </Form>
        <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

export function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      id="test-mobile"
      role="banner"
      className={`bg-contrast/80 text-primary flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link to="/" prefetch="intent">
        <Image
          loader={() =>
            'https://cdn.shopify.com/s/files/1/0608/4748/9282/files/Primary_Logo_black.png?v=1701653757'
          }
          width="180"
        />
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}
