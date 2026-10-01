import { ListingCard } from '@/components/ListingCard';
import { listings } from '@/lib/listings';

export default function Home() {
  return (
    <main>
      <h1>Homes for sale</h1>
      <p className="lead">
        Three sample listings. Each page shows the neighbourhood map, the nearest schools, shops and public transport
        with travel times, and a neighbourhood text rendered on the server so search engines index it.
      </p>
      <div className="grid">
        {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
      </div>
    </main>
  );
}
