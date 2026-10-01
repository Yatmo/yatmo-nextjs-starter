import Link from 'next/link';
import { formatPrice, type Listing } from '@/lib/listings';

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listings/${listing.id}`} className="card">
      <div className="card-photo">{listing.city}</div>
      <div className="card-body">
        <strong>{formatPrice(listing.price)}</strong>
        <span>{listing.title}</span>
        <small>{listing.surface} m² · {listing.bedrooms} bedrooms · EPC {listing.epc}</small>
      </div>
    </Link>
  );
}
