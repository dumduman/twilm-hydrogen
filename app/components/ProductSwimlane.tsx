import type {HomepageFeaturedProductsQuery} from 'storefrontapi.generated';
import {ProductCard, Section} from '~/components';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

type ProductSwimlaneProps = HomepageFeaturedProductsQuery & {
  title?: string;
  count?: number;
  paramsLocale?: string;
};

export function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  ...props
}: ProductSwimlaneProps) {
  return (
    <Section
      heading={title}
      padding="y"
      {...props}
      headingClassNames="max-w-full akzidenz-light text-center text-xl"
    >
      <div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 md:px-8 lg:px-12">
        {products.nodes.map((product, index) =>
          index < count ? (
            <ProductCard
              product={product}
              key={product.id}
              className="snap-start w-80 lg:w-72 text-center"
            />
          ) : null,
        )}
      </div>
    </Section>
  );
}
