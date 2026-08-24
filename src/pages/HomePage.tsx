import { BestSellersCarousel } from '../sections/BestSellersCarousel';
import { BrandLogoCarousel } from '../sections/BrandLogoCarousel';
import { CategoryCtaGrid } from '../sections/CategoryCtaGrid';
import { FinalCta } from '../sections/FinalCta';
import { HeroBanner } from '../sections/HeroBanner';
import { LogisticsBand } from '../sections/LogisticsBand';
import { NewArrivalsGrid } from '../sections/NewArrivalsGrid';
import { SocialIconsBar } from '../sections/SocialIconsBar';
import { Testimonials } from '../sections/Testimonials';
import { TrustBar } from '../sections/TrustBar';
import { ValuePropositionGrid } from '../sections/ValuePropositionGrid';
import { WholesaleProgram } from '../sections/WholesaleProgram';
import { banners } from '../data/banners';
import { brands } from '../data/brands';
import { categories } from '../data/categories';
import { socialLinks } from '../data/social-links';

export function HomePage() {
  return (
    <div className="flex flex-col gap-6 pb-10 sm:gap-10">
      <HeroBanner banners={banners} />
      <TrustBar />
      <CategoryCtaGrid categories={categories} />
      <BestSellersCarousel />
      <NewArrivalsGrid />
      <WholesaleProgram />
      <LogisticsBand />
      <BrandLogoCarousel brands={brands} />
      <Testimonials />
      <SocialIconsBar socialLinks={socialLinks} />
      <ValuePropositionGrid />
      <FinalCta />
    </div>
  );
}
