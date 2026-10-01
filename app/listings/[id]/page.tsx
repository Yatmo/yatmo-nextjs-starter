import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { stripMarkers } from '@yatmo/sdk';
import { YatmoMap, YatmoNeighbourhoodText, YatmoPois } from '@yatmo/react';
import { formatPrice, getListing } from '@/lib/listings';
import { COUNTRY, FRONTEND_KEY, LANGUAGE, getNeighbourhood } from '@/lib/yatmo';

type Params = Promise<{ id: string }>;

// Rendered on the first request, then cached and revalidated daily (the Yatmo data itself is cached for
// 30 days in lib/yatmo.ts). Nothing is fetched at build time, so the build needs no key.
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const listing = getListing((await params).id);
  if (!listing) return {};
  const { text } = await getNeighbourhood(listing.latitude, listing.longitude);
  // The first neighbourhood sentence makes a description search engines like: specific places, real distances.
  const neighbourhood = text?.paragraphs[0]?.sentences[0] ? stripMarkers(text.paragraphs[0].sentences[0]) : '';
  return {
    title: `${listing.title}, ${listing.city}`,
    description: `${formatPrice(listing.price)}, ${listing.surface} m², ${listing.bedrooms} bedrooms. ${neighbourhood}`.slice(0, 300),
  };
}

export default async function ListingPage({ params }: { params: Params }) {
  const listing = getListing((await params).id);
  if (!listing) notFound();
  const { text, summary } = await getNeighbourhood(listing.latitude, listing.longitude);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title,
    description: listing.description,
    url: `https://example.com/listings/${listing.id}`,
    offers: { '@type': 'Offer', price: listing.price, priceCurrency: 'EUR' },
    about: {
      '@type': 'Apartment',
      floorSize: { '@type': 'QuantitativeValue', value: listing.surface, unitCode: 'MTK' },
      numberOfBedrooms: listing.bedrooms,
      address: { '@type': 'PostalAddress', addressLocality: listing.city, addressCountry: COUNTRY },
      // A discreet listing publishes the city only; the map shows a circle.
      ...(listing.discreet ? {} : { geo: { '@type': 'GeoCoordinates', latitude: listing.latitude, longitude: listing.longitude } }),
    },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="listing-header">
        <h1>{listing.title}</h1>
        <p className="price">{formatPrice(listing.price)}</p>
      </header>

      <div className="listing">
        <div>
          <div className="gallery">Photo gallery</div>
          <h2>Description</h2>
          <p>{listing.description}</p>
        </div>
        <aside className="facts">
          <ul>
            <li>{listing.surface} m² · {listing.bedrooms} bedrooms</li>
            <li>EPC {listing.epc}</li>
            <li>{listing.city}</li>
          </ul>
          <a className="cta" href="#contact">Book a visit</a>
        </aside>
      </div>

      <section>
        <h2>Neighbourhood</h2>
        {/* The interactive map is an iframe built on the server with the frontend key: no client JavaScript needed. */}
        <YatmoMap
          licenseKey={FRONTEND_KEY} country={COUNTRY} language={LANGUAGE}
          latitude={listing.latitude} longitude={listing.longitude}
          marker={listing.discreet ? 'circle' : 'pin'} circleRadiusInMeters={300}
          isochrone="right" routeFrom="popup" rounded={12} height={520}
        />
      </section>

      <div className="columns">
        <section>
          <h2>Around the property</h2>
          {/* Nearest places by category, from the server data: part of the HTML, indexable. */}
          <YatmoPois summary={summary} categories={['education', 'transport', 'shopping']} />
        </section>
        <section>
          <h2>Living here</h2>
          {/* The neighbourhood text, rendered on the server: part of the HTML, indexable. */}
          <YatmoNeighbourhoodText text={text} titles={listing.discreet ? 'city' : 'street-city'} />
        </section>
      </div>
    </main>
  );
}
